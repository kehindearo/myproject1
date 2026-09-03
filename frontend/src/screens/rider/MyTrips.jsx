import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav from "../../components/layout/BottomNav";
import EmptyState from "../../components/ui/EmptyState";
import { MOCK_MY_TRIPS } from "../../data/mockData";
import { IconCalendar, IconArrowRight } from "../../components/ui/icons";

const TABS = ["upcoming", "active", "past"];

export default function MyTrips() {
  const [tab, setTab] = useState("upcoming");
  const navigate = useNavigate();
  const trips = MOCK_MY_TRIPS[tab];

  return (
    <div className="screen">
      <div style={{ paddingTop: "calc(env(safe-area-inset-top) + 20px)" }}>
        <h1 className="screen-title">My Trips</h1>
      </div>

      <div className="row" style={{ gap: 24, marginTop: 20, marginBottom: 20, borderBottom: "1px solid var(--border)" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "none",
              border: "none",
              padding: "0 0 12px",
              fontSize: 14,
              fontWeight: 600,
              textTransform: "capitalize",
              color: tab === t ? "var(--accent)" : "var(--text-secondary)",
              borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {trips.length === 0 ? (
            <EmptyState
              icon={<IconCalendar width={40} height={40} />}
              title="No rides yet"
              subtitle="Your booked trips will show up here"
              actionLabel="Find a Ride"
              onAction={() => navigate("/rider/find")}
            />
          ) : (
            <div className="stack gap-card">
              {trips.map((trip) => (
                <button
                  key={trip.id}
                  onClick={() => navigate(tab === "active" ? `/rider/active/${trip.id}` : `/rider/trip/${trip.id}`)}
                  className={`card card-status card-status--${trip.status} card-interactive`}
                  style={{ textAlign: "left", width: "100%", border: "none", paddingLeft: 16 }}
                >
                  <div className="row-between">
                    <p style={{ margin: 0, fontWeight: 700 }}>
                      {trip.from} <IconArrowRight width={12} height={12} stroke="var(--accent)" style={{ verticalAlign: "middle" }} /> {trip.to}
                    </p>
                    <StatusPill status={trip.status} />
                  </div>
                  <p className="body-text" style={{ fontSize: 12, marginTop: 6 }}>{trip.date} · {trip.driver.name}</p>
                  <div className="row-between" style={{ marginTop: 10 }}>
                    <span className="body-text" style={{ fontSize: 12 }}>{trip.seatsBooked} seat(s)</span>
                    <span style={{ fontWeight: 700, color: "var(--accent)" }}>₦{(trip.price * trip.seatsBooked).toLocaleString()}</span>
                  </div>
                  {trip.status === "upcoming" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="btn btn-ghost"
                      style={{ padding: 0, height: "auto", marginTop: 10, fontSize: 12, color: "var(--error)" }}
                    >
                      Cancel Trip
                    </button>
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <BottomNav variant="rider" />
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    upcoming: ["pill-warning", "Upcoming"],
    active: ["pill-success", "Active"],
    past: ["pill-neutral", "Completed"],
    cancelled: ["pill-error", "Cancelled"],
  };
  const [cls, label] = map[status] || map.past;
  return <span className={`pill ${cls}`}>{label}</span>;
}
