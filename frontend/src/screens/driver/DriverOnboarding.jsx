import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import PhoneInput from "../../components/ui/PhoneInput";
import ProgressBar from "../../components/ui/ProgressBar";
import { useToast } from "../../components/ui/Toast";
import { NIGERIAN_BANKS } from "../../data/mockData";
import { IconUser, IconCar, IconCalendar } from "../../components/ui/icons";

const STEPS = ["Personal", "Vehicle", "Documents", "Banking"];
const VEHICLE_TYPES = ["Lite", "Comfort", "XL"];
const DOC_SLOTS = ["Driver Photo", "License (Front)", "License (Back)", "Vehicle Registration", "Insurance"];

export default function DriverOnboarding() {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("NG");
  const [uploaded, setUploaded] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { show } = useToast();
  const navigate = useNavigate();

  const [personal, setPersonal] = useState({ fullName: "", phone: "", address: "", dob: "" });
  const [vehicle, setVehicle] = useState({ make: "", model: "", year: "", color: "", plate: "", type: "Comfort" });
  const [banking, setBanking] = useState({ bank: "", accountName: "", accountNumber: "" });

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else submit();
  };

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 1500);
  };

  const toggleUpload = (slot) => {
    setUploaded((u) => ({ ...u, [slot]: true }));
    show(`${slot} uploaded`, "success");
  };

  if (done) {
    return (
      <div className="screen--no-nav" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: 24 }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="pill pill-warning" style={{ padding: "10px 20px", fontSize: 14, marginBottom: 20 }}>
          ⏳ Pending Review
        </motion.div>
        <h1 className="screen-title">Application submitted!</h1>
        <p className="body-text" style={{ marginTop: 8, marginBottom: 32, maxWidth: 320 }}>
          Your account will be reviewed within 24 hours. We'll notify you by email and push notification once approved.
        </p>
        <Button onClick={() => navigate("/driver/home")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="screen--no-nav" style={{ paddingTop: "calc(env(safe-area-inset-top) + 24px)" }}>
      <ProgressBar percent={((step + 1) / STEPS.length) * 100} />
      <p className="small-label" style={{ marginTop: 12, marginBottom: 4 }}>Step {step + 1} of {STEPS.length}</p>
      <h1 className="screen-title" style={{ marginBottom: 20 }}>{STEPS[step]} Details</h1>

      <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="stack gap-card">
        {step === 0 && (
          <>
            <Input label="Full name" icon={<IconUser width={20} height={20} />} value={personal.fullName} onChange={(e) => setPersonal((p) => ({ ...p, fullName: e.target.value }))} />
            <PhoneInput country={country} onCountryChange={setCountry} value={personal.phone} onChange={(v) => setPersonal((p) => ({ ...p, phone: v }))} />
            <Input label="Home address" value={personal.address} onChange={(e) => setPersonal((p) => ({ ...p, address: e.target.value }))} />
            <Input label="Date of birth" type="date" icon={<IconCalendar width={20} height={20} />} value={personal.dob} onChange={(e) => setPersonal((p) => ({ ...p, dob: e.target.value }))} />
          </>
        )}

        {step === 1 && (
          <>
            <Input label="Make (e.g. Toyota)" icon={<IconCar width={20} height={20} />} value={vehicle.make} onChange={(e) => setVehicle((v) => ({ ...v, make: e.target.value }))} />
            <Input label="Model (e.g. Camry)" value={vehicle.model} onChange={(e) => setVehicle((v) => ({ ...v, model: e.target.value }))} />
            <div className="row" style={{ gap: 12 }}>
              <Input label="Year" value={vehicle.year} onChange={(e) => setVehicle((v) => ({ ...v, year: e.target.value }))} />
              <Input label="Color" value={vehicle.color} onChange={(e) => setVehicle((v) => ({ ...v, color: e.target.value }))} />
            </div>
            <Input label="Plate number" value={vehicle.plate} onChange={(e) => setVehicle((v) => ({ ...v, plate: e.target.value }))} />
            <p className="small-label">Vehicle Type</p>
            <div className="row" style={{ gap: 10 }}>
              {VEHICLE_TYPES.map((t) => (
                <button key={t} onClick={() => setVehicle((v) => ({ ...v, type: t }))} className="btn" style={{ flex: 1, height: 44, background: vehicle.type === t ? "var(--accent)" : "var(--input-bg)", color: vehicle.type === t ? "#fff" : "var(--text-primary)", boxShadow: "none" }}>
                  {t}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {DOC_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => toggleUpload(slot)}
                className="row-between"
                style={{
                  height: 64,
                  borderRadius: 14,
                  border: `2px dashed ${uploaded[slot] ? "var(--success)" : "var(--border)"}`,
                  background: uploaded[slot] ? "var(--success-light)" : "var(--input-bg)",
                  padding: "0 16px",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 500 }}>{slot}</span>
                <span style={{ color: uploaded[slot] ? "var(--success)" : "var(--text-secondary)", fontSize: 13, fontWeight: 600 }}>
                  {uploaded[slot] ? "✓ Uploaded" : "Upload"}
                </span>
              </button>
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <div className="field">
              <select value={banking.bank} onChange={(e) => setBanking((b) => ({ ...b, bank: e.target.value }))}>
                <option value="">Select your bank</option>
                {NIGERIAN_BANKS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <Input label="Account number" inputMode="numeric" maxLength={10} value={banking.accountNumber} onChange={(e) => setBanking((b) => ({ ...b, accountNumber: e.target.value.replace(/\D/g, "") }))} />
            <Input
              label="Account name"
              value={banking.accountNumber.length === 10 ? "AUTO-VERIFIED · " + (personal.fullName || "Account Holder") : banking.accountName}
              success={banking.accountNumber.length === 10}
              disabled={banking.accountNumber.length === 10}
              onChange={(e) => setBanking((b) => ({ ...b, accountName: e.target.value }))}
            />
          </>
        )}
      </motion.div>

      <Button block loading={submitting} onClick={next} style={{ marginTop: 32 }}>
        {step === STEPS.length - 1 ? "Submit for Approval" : "Continue"}
      </Button>
    </div>
  );
}
