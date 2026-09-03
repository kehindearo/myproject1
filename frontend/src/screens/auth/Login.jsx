import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/Toast";
import { IconMail, IconLock, IconEye, IconEyeOff, IconCar } from "../../components/ui/icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { show } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      show("Enter your email and password", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await login(email, password);
      show("Welcome back!", "success");
      navigate(res.user.role ? `/${res.user.role}/home` : "/auth/role-selection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen--no-nav" style={{ paddingTop: "calc(env(safe-area-inset-top) + 40px)" }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="stack"
        style={{ alignItems: "center", gap: 8, marginBottom: 40 }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconCar width={28} height={28} stroke="#fff" />
        </div>
        <p className="section-heading">Collabo Travel</p>
      </motion.div>

      <h1 className="screen-title">Welcome back</h1>
      <p className="body-text" style={{ marginTop: 4, marginBottom: 24 }}>
        Sign in to continue your journey
      </p>

      <form onSubmit={submit} className="stack gap-card">
        <Input
          label="Email"
          type="email"
          icon={<IconMail width={20} height={20} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type={showPw ? "text" : "password"}
          icon={<IconLock width={20} height={20} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightSlot={
            <button type="button" className="field-toggle" onClick={() => setShowPw((v) => !v)} aria-label="Toggle password visibility">
              {showPw ? <IconEyeOff width={18} height={18} /> : <IconEye width={18} height={18} />}
            </button>
          }
        />
        <div style={{ textAlign: "right", marginTop: -8 }}>
          <button type="button" className="btn btn-ghost" style={{ height: "auto", padding: 0 }} onClick={() => navigate("/auth/forgot-password")}>
            Forgot Password?
          </button>
        </div>
        <Button block type="submit" loading={loading}>
          Sign In
        </Button>
      </form>

      <div className="row" style={{ margin: "24px 0", gap: 12 }}>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        <span className="small-label">OR</span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      <button
        className="btn btn-secondary btn-block"
        onClick={() => show("Google OAuth connects once GOOGLE_CLIENT_ID is configured", "info")}
      >
        <GoogleIcon /> Continue with Google
      </button>

      <p className="body-text" style={{ textAlign: "center", marginTop: 32 }}>
        Don't have an account?{" "}
        <button className="btn btn-ghost" style={{ padding: 0, height: "auto" }} onClick={() => navigate("/auth/signup")}>
          Create one
        </button>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5C29.5 34.9 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.5l6.5 5.5C41.5 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}
