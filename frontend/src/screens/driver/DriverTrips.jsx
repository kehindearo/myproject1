import { useState } from "react";
import BottomNav from "../../components/layout/BottomNav";
import Toggle from "../../components/ui/Toggle";
import { useToast } from "../../components/ui/Toast";
import { MOCK_DRIVERS, MOCK_TRIPS } from "../../data/mockData";
import { IconChat } from "../../components/ui/icons";
import ChatSheet from "../../components/features/ChatSheet";

const RIDERS = [
  { name: "Chidinma Okeke", avatar: MOCK_DRIVERS[1].avatar, seats: 2, paid: true },
  { name: "Emeka Nwosu", avatar: MOCK_DRIVERS[2].avatar, seats: 1, paid: false },
];

export default function DriverTrips() {
  const { show } = useToast();
  const [autoAccept, setAutoAccept] = useState(false);
  const [started, setStarted] = useState(false);
  const [chatWith, setChatWith] = useState(null);
  const trip = MOCK_TRIPS[0];

  return (
    <div className="screen">
      <div style={{ paddingTop: "calc(env(safe-area-inset-top) + 20px)" }}>
        <h1 className="screen-title">My Trips</h1>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="row-between">
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>{trip.from} → {trip.to}</p>
            <p className="body-text" style={{ fontSize: 12 }}>{trip.date} · {trip.time}</p>
          </div>
          <span className={`pill ${started ? "pill-success" : "pill-warning"}`}>{started ? "In Progress" : "Upcoming"}</span>
        </div>

        <div className="row-between" style={{ marginTop: 16 }}>
          <span className="body-text">Auto-accept bookings</span>
          <Toggle checked={autoAccept} onChange={setAutoAccept} label="Auto-accept bookings" />
        </div>
      </div>

      <h2 className="section-heading" style={{ marginTop: 24, marginBottom: 12 }}>Booked Riders</h2>
      <div className="stack gap-card">
        {RIDERS.map((r) => (
          <div key={r.name} className="card row-between">
            <div className="row" style={{ gap: 10 }}>
              <img src={r.avatar} alt="" width={40} height={40} style={{ borderRadius: "50%" }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{r.name}</p>
                <p className="body-text" style={{ fontSize: 12 }}>{r.seats} seat(s)</p>
              </div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <span className={`pill ${r.paid ? "pill-success" : "pill-warning"}`}>{r.paid ? "Paid ✓" : "Pending"}</span>
              <button className="btn-icon" style={{ width: 36, height: 36 }} onClick={() => setChatWith(r)} aria-label={`Chat with ${r.name}`}>
                <IconChat width={16} height={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="row" style={{ gap: 12, marginTop: 24 }}>
        {!started ? (
          <button className="btn btn-primary btn-block" onClick={() => { setStarted(true); show("Trip started — riders notified", "success"); }}>
            Start Trip
          </button>
        ) : (
          <button className="btn btn-destructive btn-block" onClick={() => show("Trip ended — payments released", "success")}>
            End Trip
          </button>
        )}
      </div>

      <ChatSheet open={!!chatWith} onClose={() => setChatWith(null)} tripId={trip.id} peerName={chatWith?.name || "Rider"} />

      <BottomNav variant="driver" />
    </div>
  );
}
