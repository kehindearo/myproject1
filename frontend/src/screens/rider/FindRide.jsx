import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ScreenHeader from "../../components/layout/ScreenHeader";
import Chip from "../../components/ui/Chip";
import EmptyState from "../../components/ui/EmptyState";
import { MOCK_TRIPS, NIGERIAN_STATES } from "../../data/mockData";
import { IconArrowRight, IconCompass, IconStar } from "../../components/ui/icons";

const FILTERS = ["Date", "Price: Low to High", "Earliest", "Most Seats"];

export default function FindRide() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Date");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const trips = useMemo(() => {
    let list = [...MOCK_TRIPS];
    if (from) list = list.filter((t) => t.from === from);
    if (to) list = list.filter((t) => t.to === to);
    if (activeFilter === "Price: Low to High") list.sort((a, b) => a.price - b.price);
    if (activeFilter === "Most Seats") list.sort((a, b) => b.seatsLeft - a.seatsLeft);
    return list;
  }, [from, to, activeFilter]);

  return (
    <div className="screen">
      <ScreenHeader
        title="Find a Ride"
        subtitle={`${trips.length} trip${trips.length !== 1 ? "s" : ""} found`}
      />

      <div className="row" style={{ gap: 10, marginBottom: 16 }}>
        <select value={from} onChange={(e) => setFrom(e.target.value)} style={selectStyle}>
          <option value="">From (any state)</option>
          {NIGERIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value)} style={selectStyle}>
          <option value="">To (any state)</option>
          {NIGERIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="row" style={{ gap: 8, overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
        {FILTERS.map((f) => (
          <Chip key={f} active={activeFilter === f} onClick={() => setActiveFilter(f)}>
            {f}
          </Chip>
        ))}
      </div>

      {trips.length === 0 ? (
        <EmptyState
          icon={<IconCompass width={40} height={40} />}
          title="No trips available"
          subtitle="Try different filters or check back soon"
          actionLabel="Refresh"
          onAction={() => { setFrom(""); setTo(""); }}
        />
      ) : (
        <div className="stack gap-card">
          {trips.map((trip, i) => (
            <motion.button
              key={trip.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
              onClick={() => navigate(`/rider/trip/${trip.id}`)}
              className="card card-interactive"
              style={{ textAlign: "left", border: "none", width: "100%" }}
            >
              <div className="row-between">
                <p style={{ margin: 0, fontSize: 15 }}>
                  <b>{trip.from}</b>{" "}
                  <IconArrowRight width={14} height={14} stroke="var(--accent)" style={{ verticalAlign: "middle" }} />{" "}
                  <b>{trip.to}</b>
                </p>
                <span className="body-text" style={{ fontSize: 12 }}>{trip.time}</span>
              </div>
              <div style={{ height: 1, background: "var(--input-bg)", margin: "14px 0" }} />
              <div className="row" style={{ gap: 10 }}>
                <img src={trip.driver.avatar} alt="" width={40} height={40} style={{ borderRadius: "50%" }} />
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{trip.driver.name}</p>
                  <p className="body-text" style={{ fontSize: 12 }}>
                    <IconStar filled width={12} height={12} style={{ verticalAlign: "middle" }} /> {trip.driver.rating} · {trip.driver.car}
                  </p>
                </div>
              </div>
              <div className="row-between" style={{ marginTop: 14 }}>
                <span className="pill pill-success">{trip.seatsLeft} seats left</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: "var(--accent)" }}>₦{trip.price.toLocaleString()}</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

const selectStyle = {
  flex: 1,
  height: 48,
  borderRadius: 12,
  border: "none",
  background: "var(--input-bg)",
  padding: "0 12px",
  fontSize: 13,
  color: "var(--text-primary)",
};
