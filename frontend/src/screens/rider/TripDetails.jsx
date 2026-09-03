import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScreenHeader from "../../components/layout/ScreenHeader";
import BottomSheet from "../../components/ui/BottomSheet";
import Button from "../../components/ui/Button";
import StarRating from "../../components/ui/StarRating";
import { useToast } from "../../components/ui/Toast";
import { MOCK_TRIPS } from "../../data/mockData";
import { IconPin, IconFlag, IconStar, IconPlus, IconMinus, IconShare, IconChevronRight } from "../../components/ui/icons";

const PAYMENT_METHODS = ["Collabo Wallet", "Card", "Bank Transfer", "USSD"];

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { show } = useToast();
  const trip = useMemo(() => MOCK_TRIPS.find((t) => t.id === id) || MOCK_TRIPS[0], [id]);

  const [seats, setSeats] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([0]);
  const [payment, setPayment] = useState("Collabo Wallet");
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showNegotiate, setShowNegotiate] = useState(false);
  const [offer, setOffer] = useState("");
  const [negotiationStatus, setNegotiationStatus] = useState(null);
  const [booking, setBooking] = useState(false);

  const baseFare = trip.price * seats;
  const serviceFee = Math.round(baseFare * 0.05);
  const total = baseFare + serviceFee;
  const seatLayout = Array.from({ length: trip.seatsTotal }, (_, i) => ({
    taken: i >= trip.seatsLeft,
    index: i,
  }));

  const toggleSeat = (i) => {
    if (seatLayout[i].taken) return;
    setSelectedSeats((prev) => {
      const exists = prev.includes(i);
      const next = exists ? prev.filter((s) => s !== i) : [...prev, i];
      setSeats(Math.max(1, next.length));
      return next.length ? next : prev;
    });
  };

  const sendOffer = () => {
    if (!offer || Number(offer) <= 0) return show("Enter a valid amount", "error");
    setNegotiationStatus("pending");
    setTimeout(() => {
      setNegotiationStatus(Math.random() > 0.3 ? "accepted" : "countered");
    }, 1800);
  };

  const book = () => {
    setBooking(true);
    setTimeout(() => {
      setBooking(false);
      show("Trip booked successfully!", "success");
      navigate(`/rider/active/${trip.id}`);
    }, 1200);
  };

  return (
    <div className="screen" style={{ paddingBottom: 140 }}>
      <ScreenHeader title="Trip Details" />

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row" style={{ gap: 12 }}>
          <div style={{ position: "relative" }}>
            <img src={trip.driver.avatar} alt="" width={64} height={64} style={{ borderRadius: "50%" }} />
            {trip.driver.online && (
              <span style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "var(--success)", border: "2px solid var(--surface)" }} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{trip.driver.name}</p>
            <div className="row" style={{ gap: 2, marginTop: 4 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <IconStar key={n} width={14} height={14} filled={n <= Math.round(trip.driver.rating)} />
              ))}
              <span className="body-text" style={{ fontSize: 12, marginLeft: 4 }}>
                {trip.driver.rating} ({trip.driver.trips} trips)
              </span>
            </div>
            {trip.driver.verified && <span className="pill pill-success" style={{ marginTop: 6 }}>✓ Verified</span>}
          </div>
        </div>
        <p className="body-text" style={{ fontSize: 13, marginTop: 12 }}>
          {trip.driver.car} · {trip.driver.plate}
        </p>
        <button className="btn btn-ghost" style={{ padding: 0, height: "auto", marginTop: 8 }} onClick={() => setShowDriverModal(true)}>
          View Profile <IconChevronRight width={14} height={14} />
        </button>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row" style={{ gap: 12, alignItems: "flex-start" }}>
          <div className="stack" style={{ alignItems: "center", gap: 0 }}>
            <IconPin width={18} height={18} stroke="var(--success)" />
            <div style={{ width: 2, height: 32, borderLeft: "2px dotted var(--border)" }} />
            <IconFlag width={18} height={18} stroke="var(--error)" />
          </div>
          <div style={{ flex: 1 }}>
            <p className="small-label">From</p>
            <p style={{ fontWeight: 700, fontSize: 16, margin: "2px 0" }}>{trip.from}</p>
            <p className="body-text" style={{ fontSize: 12, marginBottom: 20 }}>{trip.fromDetail}</p>
            <p className="small-label">To</p>
            <p style={{ fontWeight: 700, fontSize: 16, margin: "2px 0" }}>{trip.to}</p>
            <p className="body-text" style={{ fontSize: 12 }}>{trip.toDetail}</p>
          </div>
        </div>
        <div style={{ height: 1, background: "var(--input-bg)", margin: "16px 0 10px" }} />
        <p className="body-text" style={{ fontSize: 12 }}>
          📅 {trip.date} · ⏱ {trip.duration} · 🕗 {trip.time}
        </p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 className="section-heading" style={{ marginBottom: 12 }}>Select Seats</h3>
        <div style={{ background: "var(--input-bg)", borderRadius: 16, padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 200, margin: "0 auto" }}>
            {seatLayout.map((seat) => (
              <button
                key={seat.index}
                onClick={() => toggleSeat(seat.index)}
                disabled={seat.taken}
                style={{
                  height: 48,
                  borderRadius: 10,
                  border: "none",
                  background: seat.taken ? "var(--text-disabled)" : selectedSeats.includes(seat.index) ? "var(--accent)" : "var(--success)",
                  color: "#fff",
                  fontWeight: 700,
                  opacity: seat.taken ? 0.5 : 1,
                }}
              >
                {seat.index + 1}
              </button>
            ))}
          </div>
          <div className="row" style={{ justifyContent: "center", gap: 16, marginTop: 12, fontSize: 11 }}>
            <LegendDot color="var(--success)" label="Available" />
            <LegendDot color="var(--accent)" label="Selected" />
            <LegendDot color="var(--text-disabled)" label="Taken" />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-heading" style={{ marginBottom: 12 }}>Pay & Book</h3>
        <div className="row-between">
          <span className="body-text">Seats</span>
          <div className="row" style={{ gap: 12 }}>
            <button className="btn-icon" style={{ width: 32, height: 32, background: "var(--input-bg)", color: "var(--accent)" }} onClick={() => setSeats((s) => Math.max(1, s - 1))}>
              <IconMinus width={16} height={16} />
            </button>
            <span style={{ fontWeight: 700, fontSize: 16 }}>{seats}</span>
            <button className="btn-icon" style={{ width: 32, height: 32, background: "var(--input-bg)", color: "var(--accent)" }} onClick={() => setSeats((s) => Math.min(trip.seatsLeft, s + 1))}>
              <IconPlus width={16} height={16} />
            </button>
          </div>
        </div>

        <div style={{ marginTop: 16 }} className="stack" >
          <Row label="Base fare" value={`₦${baseFare.toLocaleString()}`} />
          <Row label="Service fee" value={`₦${serviceFee.toLocaleString()}`} />
        </div>
        <div style={{ height: 1, background: "var(--input-bg)", margin: "12px 0" }} />
        <div className="row-between">
          <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Total to Pay</span>
          <span className="price-display">₦{total.toLocaleString()}</span>
        </div>

        <p className="small-label" style={{ marginTop: 20, marginBottom: 8 }}>Payment Method</p>
        <div className="stack gap-card">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m}
              onClick={() => setPayment(m)}
              className="row-between"
              style={{
                height: 48,
                borderRadius: 12,
                border: `1.5px solid ${payment === m ? "var(--accent)" : "var(--border)"}`,
                background: payment === m ? "rgba(255,107,0,0.06)" : "transparent",
                padding: "0 16px",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {m}
              {payment === m && <span style={{ color: "var(--accent)" }}>✓</span>}
            </button>
          ))}
        </div>

        <p className="body-text" style={{ textAlign: "center", color: "var(--success)", fontSize: 12, marginTop: 16 }}>
          🔒 Secured by Monnify
        </p>

        <div className="row" style={{ gap: 12, marginTop: 16 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowNegotiate(true)}>
            Negotiate Fare
          </button>
          <button
            className="btn btn-secondary"
            style={{ width: 56, padding: 0 }}
            aria-label="Share via WhatsApp"
            onClick={() => show("Trip link copied — share via WhatsApp", "success")}
          >
            <IconShare width={18} height={18} />
          </button>
        </div>
      </div>

      <div
        className="glass"
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          padding: "16px 24px calc(env(safe-area-inset-bottom) + 16px)",
        }}
      >
        <Button block loading={booking} onClick={book}>
          Book Now — ₦{total.toLocaleString()}
        </Button>
      </div>

      <BottomSheet open={showDriverModal} onClose={() => setShowDriverModal(false)} title="Driver Profile">
        <div className="stack" style={{ alignItems: "center", gap: 8, marginBottom: 20 }}>
          <img src={trip.driver.avatar} alt="" width={80} height={80} style={{ borderRadius: "50%" }} />
          <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{trip.driver.name}</p>
          <StarRating value={Math.round(trip.driver.rating)} readOnly size={20} />
        </div>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <span className="body-text">Total trips</span>
          <b>{trip.driver.trips}</b>
        </div>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <span className="body-text">Member since</span>
          <b>{trip.driver.memberSince}</b>
        </div>
        <div className="row-between">
          <span className="body-text">Response rate</span>
          <b>{trip.driver.responseRate}%</b>
        </div>
      </BottomSheet>

      <BottomSheet open={showNegotiate} onClose={() => { setShowNegotiate(false); setNegotiationStatus(null); }} title="Negotiate Fare">
        <p className="body-text" style={{ marginBottom: 16 }}>
          Listed price: <b style={{ color: "var(--text-primary)" }}>₦{trip.price.toLocaleString()}</b> per seat. Propose your offer below.
        </p>
        {!negotiationStatus && (
          <>
            <div className="field">
              <input placeholder="Your offer (₦)" value={offer} onChange={(e) => setOffer(e.target.value.replace(/\D/g, ""))} inputMode="numeric" />
            </div>
            <Button block style={{ marginTop: 16 }} onClick={sendOffer}>Send Offer</Button>
          </>
        )}
        {negotiationStatus === "pending" && (
          <div className="stack" style={{ alignItems: "center", padding: 24, gap: 12 }}>
            <span className="spinner spinner-accent" style={{ width: 32, height: 32, borderWidth: 3 }} />
            <p className="body-text">Waiting for driver's response…</p>
          </div>
        )}
        {negotiationStatus === "accepted" && (
          <div className="stack" style={{ alignItems: "center", padding: 16, gap: 8 }}>
            <span className="pill pill-success" style={{ fontSize: 13, padding: "8px 16px" }}>Offer Accepted 🎉</span>
            <p className="body-text">Driver accepted ₦{Number(offer).toLocaleString()} per seat.</p>
            <Button block onClick={() => { setShowNegotiate(false); setNegotiationStatus(null); }}>Continue to Book</Button>
          </div>
        )}
        {negotiationStatus === "countered" && (
          <div className="stack" style={{ alignItems: "center", padding: 16, gap: 8 }}>
            <span className="pill pill-warning" style={{ fontSize: 13, padding: "8px 16px" }}>Driver Countered</span>
            <p className="body-text">Driver proposed ₦{(Number(offer) + 500).toLocaleString()} per seat instead.</p>
            <div className="row" style={{ gap: 12, width: "100%" }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setNegotiationStatus(null)}>Counter Again</button>
              <Button style={{ flex: 1 }} onClick={() => { setShowNegotiate(false); setNegotiationStatus(null); }}>Accept</Button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="row-between" style={{ padding: "6px 0" }}>
      <span className="body-text">{label}</span>
      <span style={{ fontSize: 14, color: "var(--text-primary)" }}>{value}</span>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span className="row" style={{ gap: 4 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}
