import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "../../components/ui/Toast";
import {
  ADMIN_STATS, REVENUE_SERIES, PENDING_DRIVERS, ALL_TRIPS_TABLE, USERS_TABLE, FLAGGED_REPORTS, PROMO_CODES,
} from "../../data/adminMockData";
import { IconCar, IconWallet, IconList, IconShield, IconBell } from "../../components/ui/icons";

const NAV = [
  { key: "overview", label: "Overview" },
  { key: "drivers", label: "Driver Approvals" },
  { key: "trips", label: "All Trips" },
  { key: "users", label: "Users" },
  { key: "reports", label: "Flagged Reports" },
  { key: "promo", label: "Promo Codes" },
  { key: "settings", label: "Settings" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("collabo-admin")) navigate("/admin/login");
  }, [navigate]);

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", background: "var(--background)", overflow: "hidden" }}>
      <aside style={{ width: 240, background: "var(--primary)", padding: "24px 16px", flexShrink: 0, overflowY: "auto" }}>
        <div className="row" style={{ gap: 10, padding: "0 8px 24px" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconCar width={18} height={18} stroke="#fff" />
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Collabo Admin</span>
        </div>
        {NAV.map((n) => (
          <button
            key={n.key}
            onClick={() => setTab(n.key)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: tab === n.key ? "rgba(255,107,0,0.15)" : "transparent",
              color: tab === n.key ? "var(--accent)" : "rgba(255,255,255,0.75)",
              border: "none",
              borderRadius: 10,
              padding: "12px 12px",
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            {n.label}
          </button>
        ))}
        <button
          onClick={() => { sessionStorage.removeItem("collabo-admin"); navigate("/admin/login"); }}
          style={{ display: "block", width: "100%", textAlign: "left", background: "transparent", color: "var(--error)", border: "none", borderRadius: 10, padding: "12px 12px", fontSize: 14, fontWeight: 600, marginTop: 24 }}
        >
          Log Out
        </button>
      </aside>

      <main style={{ flex: 1, overflowY: "auto", padding: 32 }}>
        <div className="row-between" style={{ marginBottom: 24 }}>
          <h1 className="screen-title">{NAV.find((n) => n.key === tab)?.label}</h1>
          <button className="btn-icon" aria-label="Notifications"><IconBell width={18} height={18} /></button>
        </div>

        {tab === "overview" && <Overview />}
        {tab === "drivers" && <DriverApprovals />}
        {tab === "trips" && <TripsTable />}
        {tab === "users" && <UsersTable />}
        {tab === "reports" && <Reports />}
        {tab === "promo" && <PromoManager />}
        {tab === "settings" && <Settings />}
      </main>
    </div>
  );
}

function Overview() {
  const max = Math.max(...REVENUE_SERIES.map((d) => d.value));
  const cards = [
    { label: "Total Riders", value: ADMIN_STATS.totalRiders.toLocaleString(), icon: <IconList width={18} height={18} /> },
    { label: "Total Drivers", value: ADMIN_STATS.totalDrivers.toLocaleString(), icon: <IconCar width={18} height={18} /> },
    { label: "Active Trips Now", value: ADMIN_STATS.activeTripsNow, icon: <IconShield width={18} height={18} /> },
    { label: "Total Revenue", value: `₦${(ADMIN_STATS.totalRevenue / 1_000_000).toFixed(1)}M`, icon: <IconWallet width={18} height={18} /> },
    { label: "Today's Revenue", value: `₦${(ADMIN_STATS.todayRevenue / 1000).toFixed(0)}K`, icon: <IconWallet width={18} height={18} /> },
  ];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 24 }}>
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
            <span style={{ color: "var(--accent)" }}>{c.icon}</span>
            <p className="small-label" style={{ marginTop: 10 }}>{c.label}</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)", margin: "4px 0 0" }}>{c.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <h3 className="section-heading" style={{ marginBottom: 20 }}>Revenue (Last 7 Days, ₦M)</h3>
        <div className="row" style={{ alignItems: "flex-end", gap: 16, height: 160 }}>
          {REVENUE_SERIES.map((d, i) => (
            <div key={d.label} className="stack" style={{ flex: 1, alignItems: "center", gap: 8 }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.value / max) * 120}px` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                style={{ width: "100%", maxWidth: 40, background: "linear-gradient(180deg, var(--primary-light), var(--primary))", borderRadius: 8 }}
              />
              <span className="body-text" style={{ fontSize: 11 }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function DriverApprovals() {
  const { show } = useToast();
  const [items, setItems] = useState(PENDING_DRIVERS);

  const act = (id, action) => {
    setItems((list) => list.filter((d) => d.id !== id));
    show(`Driver ${action === "approve" ? "approved" : "rejected"} — email notification sent`, action === "approve" ? "success" : "info");
  };

  if (!items.length) return <p className="body-text">No pending driver applications 🎉</p>;

  return (
    <div className="stack gap-card">
      {items.map((d) => (
        <div key={d.id} className="card row-between">
          <div className="row" style={{ gap: 12 }}>
            <img src={d.avatar} alt="" width={48} height={48} style={{ borderRadius: "50%" }} />
            <div>
              <p style={{ fontWeight: 700, margin: 0 }}>{d.name}</p>
              <p className="body-text" style={{ fontSize: 12 }}>{d.car} · Submitted {d.submitted}</p>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-destructive" style={{ height: 40, padding: "0 16px" }} onClick={() => act(d.id, "reject")}>Reject</button>
            <button className="btn" style={{ height: 40, padding: "0 16px", background: "var(--success)", color: "#fff", boxShadow: "none" }} onClick={() => act(d.id, "approve")}>Approve</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TripsTable() {
  return (
    <Table
      headers={["Route", "Driver", "Rider", "Status", "Amount", "Date"]}
      rows={ALL_TRIPS_TABLE.map((t) => [
        t.route, t.driver, t.rider,
        <StatusBadge key="s" status={t.status} />,
        `₦${t.amount.toLocaleString()}`, t.date,
      ])}
    />
  );
}

function UsersTable() {
  const { show } = useToast();
  return (
    <Table
      headers={["Name", "Email", "Role", "Status", "Actions"]}
      rows={USERS_TABLE.map((u) => [
        u.name, u.email, u.role,
        <StatusBadge key="s" status={u.status} />,
        <div key="a" className="row" style={{ gap: 8 }}>
          <button className="btn btn-ghost" style={{ padding: 0, height: "auto", fontSize: 12 }} onClick={() => show(`Message sent to ${u.name}`, "success")}>Message</button>
          <button className="btn btn-ghost" style={{ padding: 0, height: "auto", fontSize: 12, color: "var(--error)" }} onClick={() => show(`${u.name} suspended`, "info")}>Suspend</button>
        </div>,
      ])}
    />
  );
}

function Reports() {
  const [items, setItems] = useState(FLAGGED_REPORTS);
  const cycle = (id) => {
    const order = ["Open", "Investigating", "Resolved"];
    setItems((list) => list.map((r) => r.id === id ? { ...r, status: order[(order.indexOf(r.status) + 1) % order.length] } : r));
  };

  return (
    <div className="stack gap-card">
      {items.map((r) => (
        <div key={r.id} className={`card card-status card-status--${r.severity === "critical" ? "cancelled" : r.severity === "medium" ? "upcoming" : "past"}`} style={{ paddingLeft: 16 }}>
          <div className="row-between">
            <div>
              <p style={{ fontWeight: 700, margin: 0 }}>{r.type}</p>
              <p className="body-text" style={{ fontSize: 12 }}>{r.user} · {r.detail}</p>
            </div>
            <button onClick={() => cycle(r.id)} className={`pill ${r.status === "Resolved" ? "pill-success" : r.status === "Investigating" ? "pill-warning" : "pill-error"}`} style={{ border: "none", cursor: "pointer" }}>
              {r.status}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PromoManager() {
  const { show } = useToast();
  const [codes, setCodes] = useState(PROMO_CODES);
  return (
    <>
      <button className="btn btn-primary" style={{ height: 44, marginBottom: 16 }} onClick={() => show("New promo code created", "success")}>+ New Promo Code</button>
      <Table
        headers={["Code", "Discount", "Uses", "Status", ""]}
        rows={codes.map((c, i) => [
          <b key="c">{c.code}</b>, c.discount, c.uses,
          <span key="s" className={`pill ${c.active ? "pill-success" : "pill-neutral"}`}>{c.active ? "Active" : "Disabled"}</span>,
          <button
            key="t"
            className="btn btn-ghost"
            style={{ padding: 0, height: "auto", fontSize: 12 }}
            onClick={() => setCodes((list) => list.map((x, xi) => xi === i ? { ...x, active: !x.active } : x))}
          >
            {c.active ? "Disable" : "Enable"}
          </button>,
        ])}
      />
    </>
  );
}

function Settings() {
  const { show } = useToast();
  return (
    <div className="stack gap-card" style={{ maxWidth: 480 }}>
      <div className="card">
        <p className="small-label" style={{ marginBottom: 8 }}>Platform Commission</p>
        <input defaultValue="10" style={{ ...inputStyle }} />
      </div>
      <div className="card">
        <p className="small-label" style={{ marginBottom: 8 }}>Surge Multiplier (Peak Hours)</p>
        <input defaultValue="1.5" style={{ ...inputStyle }} />
      </div>
      <div className="card">
        <p className="small-label" style={{ marginBottom: 8 }}>Send Push Notification</p>
        <textarea placeholder="Message to all riders, drivers, or specific users" style={{ width: "100%", minHeight: 80, border: "1px solid var(--border)", borderRadius: 12, padding: 12 }} />
        <button className="btn btn-primary" style={{ marginTop: 12, height: 40 }} onClick={() => show("Notification queued via Firebase Cloud Messaging", "success")}>Send</button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { Active: "pill-success", Completed: "pill-neutral", Scheduled: "pill-warning", Suspended: "pill-error" };
  return <span className={`pill ${map[status] || "pill-neutral"}`}>{status}</span>;
}

function Table({ headers, rows }) {
  return (
    <div className="card" style={{ padding: 0, overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} style={{ textAlign: "left", padding: 16, color: "var(--text-secondary)", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: 16, borderBottom: "1px solid var(--border)", color: "var(--text-primary)" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const inputStyle = { width: "100%", height: 48, borderRadius: 12, border: "1px solid var(--border)", padding: "0 12px" };
