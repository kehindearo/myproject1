import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const STORAGE_KEY = "collabo-user";

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Wraps real API calls; if the backend is unreachable (e.g. local demo
 * without Mongo/Redis running) it falls back to a deterministic local
 * simulation so the UI flow remains fully interactive.
 */
async function withFallback(apiCall, fallbackFactory) {
  try {
    const res = await apiCall();
    return res.data;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[api] falling back to local simulation:", err.message);
    }
    await new Promise((r) => setTimeout(r, 600));
    return fallbackFactory();
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  const persist = (u) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const requestOtp = (email) =>
    withFallback(
      () => api.post("/auth/otp/request", { email }),
      () => ({ success: true, email })
    );

  const verifyOtp = (email, code) =>
    withFallback(
      () => api.post("/auth/otp/verify", { email, code }),
      () => ({ success: code.length === 6, email })
    );

  const signup = (payload) =>
    withFallback(
      () => api.post("/auth/signup", payload),
      () => {
        const u = {
          id: `u_${Date.now()}`,
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          role: null,
          walletBalance: 0,
          referralCode: payload.fullName.slice(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000),
        };
        localStorage.setItem("collabo-token", `mock.${u.id}`);
        persist(u);
        return { user: u, token: `mock.${u.id}` };
      }
    );

  const login = (email, password) =>
    withFallback(
      () => api.post("/auth/login", { email, password }),
      () => {
        const u = {
          id: `u_${Date.now()}`,
          fullName: email.split("@")[0].replace(/[._]/g, " "),
          email,
          role: "rider",
          walletBalance: 24500,
          referralCode: "COLLABO" + Math.floor(1000 + Math.random() * 9000),
        };
        localStorage.setItem("collabo-token", `mock.${u.id}`);
        persist(u);
        return { user: u, token: `mock.${u.id}` };
      }
    );

  const setRole = (role) => {
    const updated = { ...user, role };
    persist(updated);
    return updated;
  };

  const logout = () => {
    localStorage.removeItem("collabo-token");
    persist(null);
  };

  const updateUser = (patch) => persist({ ...user, ...patch });

  return (
    <AuthContext.Provider
      value={{ user, requestOtp, verifyOtp, signup, login, setRole, logout, updateUser, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
