import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import OtpInput from "../../components/ui/OtpInput";
import PhoneInput from "../../components/ui/PhoneInput";
import ProgressBar from "../../components/ui/ProgressBar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/Toast";
import { IconMail, IconLock, IconEye, IconEyeOff, IconUser } from "../../components/ui/icons";

function strength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function Signup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [otpError, setOtpError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", country: "NG", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const navigate = useNavigate();
  const { requestOtp, verifyOtp, signup } = useAuth();
  const { show } = useToast();

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const sendCode = async () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      show("Enter a valid email address", "error");
      return;
    }
    setLoading(true);
    await requestOtp(email);
    setLoading(false);
    setCountdown(59);
    setStep(2);
    show("Verification code sent", "success");
  };

  const submitOtp = async (code) => {
    const res = await verifyOtp(email, code);
    if (res.success) {
      setOtpError(false);
      setStep(3);
    } else {
      setOtpError(true);
      show("Incorrect code, try again", "error");
    }
  };

  const pwStrength = strength(form.password);
  const strengthColor = ["var(--error)", "var(--error)", "var(--warning)", "var(--success)", "var(--success)"][pwStrength];
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];

  const finishSignup = async () => {
    if (!form.fullName || form.phone.length < 7) {
      show("Please complete all fields", "error");
      return;
    }
    if (form.password.length < 8) {
      show("Password must be at least 8 characters", "error");
      return;
    }
    if (form.password !== form.confirm) {
      show("Passwords do not match", "error");
      return;
    }
    setLoading(true);
    await signup({ ...form, email, phone: `+234${form.phone}` });
    setLoading(false);
    show("Account created!", "success");
    navigate("/auth/role-selection");
  };

  const percent = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="screen--no-nav" style={{ paddingTop: "calc(env(safe-area-inset-top) + 24px)" }}>
      <ProgressBar percent={percent} />
      <p className="small-label" style={{ marginTop: 12 }}>Step {step} of 3</p>

      {step === 1 && (
        <motion.div
          key="step1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="stack gap-card"
          style={{ marginTop: 12 }}
        >
          <h1 className="screen-title">Create account</h1>
          <p className="body-text">We'll send a verification code to your email.</p>
          <div style={{ marginTop: 8 }}>
            <Input
              label="Email address"
              type="email"
              icon={<IconMail width={20} height={20} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button block loading={loading} onClick={sendCode} style={{ marginTop: 16 }}>
            Send Verification Code
          </Button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          key="step2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="stack"
          style={{ marginTop: 12, alignItems: "center", textAlign: "center", gap: 8 }}
        >
          <h1 className="screen-title">Check your email</h1>
          <p className="body-text">
            We sent a 6-digit code to <b style={{ color: "var(--accent)" }}>{email}</b>
          </p>
          <div style={{ margin: "24px 0" }}>
            <OtpInput length={6} onComplete={submitOtp} error={otpError} />
          </div>
          {countdown > 0 ? (
            <p className="body-text">Resend in {countdown}s</p>
          ) : (
            <button className="btn btn-ghost" onClick={sendCode}>Resend Code</button>
          )}
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          key="step3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="stack gap-card"
          style={{ marginTop: 12 }}
        >
          <h1 className="screen-title">Complete your profile</h1>
          <Input
            label="Full name"
            icon={<IconUser width={20} height={20} />}
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          />
          <PhoneInput
            country={form.country}
            onCountryChange={(c) => setForm((f) => ({ ...f, country: c }))}
            value={form.phone}
            onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
          />
          <Input
            label="Password"
            type={showPw ? "text" : "password"}
            icon={<IconLock width={20} height={20} />}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            rightSlot={
              <button type="button" className="field-toggle" onClick={() => setShowPw((v) => !v)} aria-label="Toggle password visibility">
                {showPw ? <IconEyeOff width={18} height={18} /> : <IconEye width={18} height={18} />}
              </button>
            }
          />
          {form.password && (
            <div style={{ marginTop: -8 }}>
              <ProgressBar percent={pwStrength * 25} color={strengthColor} height={4} />
              <p className="small-label" style={{ marginTop: 4, color: strengthColor, textTransform: "none", letterSpacing: 0 }}>
                {strengthLabel}
              </p>
            </div>
          )}
          <Input
            label="Confirm password"
            type={showConfirmPw ? "text" : "password"}
            icon={<IconLock width={20} height={20} />}
            value={form.confirm}
            success={form.confirm && form.confirm === form.password}
            error={form.confirm && form.confirm !== form.password ? "Passwords don't match" : undefined}
            helperText={form.confirm && form.confirm !== form.password ? "Passwords don't match" : undefined}
            onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
            rightSlot={
              !(form.confirm && form.confirm === form.password) && (
                <button type="button" className="field-toggle" onClick={() => setShowConfirmPw((v) => !v)} aria-label="Toggle password visibility">
                  {showConfirmPw ? <IconEyeOff width={18} height={18} /> : <IconEye width={18} height={18} />}
                </button>
              )
            }
          />
          <Button block loading={loading} onClick={finishSignup} style={{ marginTop: 8 }}>
            Create Account
          </Button>
        </motion.div>
      )}

      <p className="body-text" style={{ textAlign: "center", marginTop: 24 }}>
        Already have an account?{" "}
        <button className="btn btn-ghost" style={{ padding: 0, height: "auto" }} onClick={() => navigate("/auth/login")}>
          Sign in
        </button>
      </p>
    </div>
  );
}
