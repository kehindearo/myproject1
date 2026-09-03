import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useToast } from "../../components/ui/Toast";
import { IconMail, IconLock, IconCar } from "../../components/ui/icons";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { show } = useToast();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!email || !password) return show("Enter admin credentials", "error");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("collabo-admin", "1");
      navigate("/admin/dashboard");
    }, 900);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 380, background: "var(--surface)", borderRadius: 20, padding: 32 }}>
        <div className="stack" style={{ alignItems: "center", gap: 8, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconCar width={28} height={28} stroke="#fff" />
          </div>
          <p className="section-heading">Collabo Travel Admin</p>
        </div>
        <div className="stack gap-card">
          <Input label="Admin email" icon={<IconMail width={20} height={20} />} value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" icon={<IconLock width={20} height={20} />} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button block type="submit" loading={loading} style={{ marginTop: 24 }}>Sign In to Admin Panel</Button>
      </form>
    </div>
  );
}
