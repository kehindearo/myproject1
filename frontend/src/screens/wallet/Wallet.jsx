import { useState } from "react";
import { motion } from "framer-motion";
import BottomNav from "../../components/layout/BottomNav";
import BottomSheet from "../../components/ui/BottomSheet";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/Toast";
import { TRANSACTIONS } from "../../data/mockData";
import { IconWallet, IconPlus, IconArrowRight } from "../../components/ui/icons";

const TOPUP_METHODS = ["Card", "Bank Transfer", "USSD", "QR Code"];

const TYPE_META = {
  credit: { color: "var(--success)", bg: "var(--success-light)", symbol: "+" },
  debit: { color: "var(--error)", bg: "#fee2e2", symbol: "" },
  withdrawal: { color: "var(--info)", bg: "#dbeafe", symbol: "" },
};

export default function Wallet({ variant = "rider" }) {
  const { user, updateUser } = useAuth();
  const { show } = useToast();
  const [showTopUp, setShowTopUp] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Card");
  const [processing, setProcessing] = useState(false);
  const balance = user?.walletBalance ?? 24500;

  const topUp = () => {
    if (!amount || Number(amount) <= 0) return show("Enter a valid amount", "error");
    setProcessing(true);
    setTimeout(() => {
      updateUser({ walletBalance: balance + Number(amount) });
      setProcessing(false);
      setShowTopUp(false);
      setAmount("");
      show(`₦${Number(amount).toLocaleString()} added to your wallet`, "success");
    }, 1400);
  };

  return (
    <div className="screen">
      <div style={{ paddingTop: "calc(env(safe-area-inset-top) + 20px)" }}>
        <h1 className="screen-title">Wallet</h1>
      </div>

      <div
        className="card-hero"
        style={{ marginTop: 20, position: "relative" }}
      >
        <div style={{ position: "absolute", bottom: -10, left: -10, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <p style={{ fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase", opacity: 0.8, margin: 0 }}>Collabo Wallet</p>
        <motion.p
          key={balance}
          initial={{ opacity: 0.4, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 40, fontWeight: 800, margin: "8px 0 20px" }}
        >
          ₦{balance.toLocaleString()}.00
        </motion.p>
        <div className="row" style={{ gap: 12 }}>
          <button className="btn" style={{ background: "var(--accent)", color: "#fff", height: 44, flex: 1, boxShadow: "var(--shadow-accent-glow)" }} onClick={() => setShowTopUp(true)}>
            <IconPlus width={16} height={16} /> Top Up
          </button>
          <button className="btn" style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.4)", color: "#fff", height: 44, flex: 1 }}>
            ↑ Withdraw
          </button>
        </div>
      </div>

      <section style={{ marginTop: 28 }}>
        <h2 className="section-heading" style={{ marginBottom: 4 }}>Your Referral Code</h2>
        <div className="card row-between" style={{ marginTop: 12 }}>
          <div>
            <p style={{ fontWeight: 800, fontSize: 20, letterSpacing: 1, color: "var(--primary)", margin: 0 }}>
              {user?.referralCode || "COLLABO2026"}
            </p>
            <p className="body-text" style={{ fontSize: 12 }}>Earn ₦1,000 when a friend completes their first trip</p>
          </div>
          <button className="btn btn-secondary" style={{ height: 40, padding: "0 16px" }} onClick={() => show("Referral code copied", "success")}>
            Copy
          </button>
        </div>
      </section>

      <section style={{ marginTop: 32, marginBottom: 32 }}>
        <h2 className="section-heading" style={{ marginBottom: 12 }}>Transactions</h2>
        {TRANSACTIONS.length === 0 ? (
          <EmptyState icon={<IconWallet width={40} height={40} />} title="No transactions yet" subtitle="Top up to get started" actionLabel="Top Up" onAction={() => setShowTopUp(true)} />
        ) : (
          <div className="stack gap-card">
            {TRANSACTIONS.map((tx) => {
              const meta = TYPE_META[tx.type];
              return (
                <div key={tx.id} className="card row-between">
                  <div className="row" style={{ gap: 12 }}>
                    <span style={{ width: 40, height: 40, borderRadius: "50%", background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", color: meta.color }}>
                      <IconArrowRight width={16} height={16} style={{ transform: tx.amount < 0 ? "rotate(-45deg)" : "rotate(135deg)" }} />
                    </span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{tx.title}</p>
                      <p className="body-text" style={{ fontSize: 12 }}>{tx.date}</p>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: meta.color }}>
                    {tx.amount > 0 ? "+" : "-"}₦{Math.abs(tx.amount).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <BottomSheet open={showTopUp} onClose={() => setShowTopUp(false)} title="Top Up Wallet">
        <div className="field" style={{ marginBottom: 16 }}>
          <input placeholder="Amount (₦)" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} inputMode="numeric" />
        </div>
        <div className="stack gap-card" style={{ marginBottom: 20 }}>
          {TOPUP_METHODS.map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className="row-between"
              style={{ height: 48, borderRadius: 12, border: `1.5px solid ${method === m ? "var(--accent)" : "var(--border)"}`, background: method === m ? "rgba(255,107,0,0.06)" : "transparent", padding: "0 16px" }}
            >
              {m} {method === m && <span style={{ color: "var(--accent)" }}>✓</span>}
            </button>
          ))}
        </div>
        <Button block loading={processing} onClick={topUp}>Top Up via Monnify</Button>
      </BottomSheet>

      <BottomNav variant={variant} />
    </div>
  );
}
