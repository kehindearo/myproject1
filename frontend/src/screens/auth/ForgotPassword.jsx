import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import OtpInput from "../../components/ui/OtpInput";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/Toast";
import { IconMail, IconLock, IconEye, IconEyeOff } from "../../components/ui/icons";
import ScreenHeader from "../../components/layout/ScreenHeader";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { requestOtp, verifyOtp } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  const sendCode = async () => {
    if (!/\S+@\S+\.\S+/.test(email)) return show("Enter a valid email", "error");
    setLoading(true);
    await requestOtp(email);
    setLoading(false);
    setStep(2);
    show("Reset code sent to your email", "success");
  };

  const submitOtp = async (code) => {
    const res = await verifyOtp(email, code);
    if (res.success) setStep(3);
    else show("Incorrect code", "error");
  };

  const resetPassword = () => {
    if (pw.length < 8) return show("Password must be at least 8 characters", "error");
    if (pw !== confirm) return show("Passwords do not match", "error");
    show("Password reset successfully", "success");
    navigate("/auth/login");
  };

  return (
    <div className="screen--no-nav" style={{ paddingTop: "calc(env(safe-area-inset-top) + 24px)" }}>
      <ScreenHeader dark={false} title="Reset Password" onBack={() => navigate(-1)} />

      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="stack gap-card">
          <p className="body-text">Enter your email and we'll send a code to reset your password.</p>
          <Input label="Email address" icon={<IconMail width={20} height={20} />} value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button block loading={loading} onClick={sendCode}>Send Reset Code</Button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="stack" style={{ alignItems: "center", textAlign: "center", gap: 8 }}>
          <p className="body-text">Enter the 6-digit code sent to <b style={{ color: "var(--accent)" }}>{email}</b></p>
          <div style={{ margin: "24px 0" }}>
            <OtpInput length={6} onComplete={submitOtp} />
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="stack gap-card">
          <Input
            label="New password"
            type={showPw ? "text" : "password"}
            icon={<IconLock width={20} height={20} />}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            rightSlot={
              <button type="button" className="field-toggle" onClick={() => setShowPw((v) => !v)} aria-label="Toggle password visibility">
                {showPw ? <IconEyeOff width={18} height={18} /> : <IconEye width={18} height={18} />}
              </button>
            }
          />
          <Input
            label="Confirm new password"
            type={showPw ? "text" : "password"}
            icon={<IconLock width={20} height={20} />}
            value={confirm}
            success={confirm && confirm === pw}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <Button block onClick={resetPassword}>Reset Password</Button>
        </motion.div>
      )}
    </div>
  );
}
