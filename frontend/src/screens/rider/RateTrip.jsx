import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import StarRating from "../../components/ui/StarRating";
import Chip from "../../components/ui/Chip";
import Button from "../../components/ui/Button";
import { useToast } from "../../components/ui/Toast";
import { MOCK_TRIPS, REVIEW_TAGS } from "../../data/mockData";

export default function RateTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { show } = useToast();
  const trip = useMemo(() => MOCK_TRIPS.find((t) => t.id === id) || MOCK_TRIPS[0], [id]);

  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState([]);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag) => setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]));

  const submit = () => {
    if (!rating) return show("Please select a star rating", "error");
    setSubmitted(true);
    show("Thanks for your feedback!", "success");
  };

  if (submitted) {
    return (
      <div className="screen--no-nav" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center" }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} style={{ fontSize: 64, marginBottom: 16 }}>
          🎉
        </motion.div>
        <h1 className="screen-title">Rating submitted!</h1>
        <p className="body-text" style={{ marginTop: 8, marginBottom: 32 }}>Thanks for helping the Collabo community.</p>
        <Button onClick={() => navigate("/rider/home")}>Book another ride</Button>
      </div>
    );
  }

  return (
    <div className="screen--no-nav" style={{ paddingTop: "calc(env(safe-area-inset-top) + 32px)" }}>
      <h1 className="display-heading" style={{ fontSize: 26, textAlign: "center" }}>You have arrived! 🎉</h1>

      <div className="card" style={{ marginTop: 24, marginBottom: 16 }}>
        <h3 className="section-heading" style={{ marginBottom: 10 }}>Fare Breakdown</h3>
        <Row label="Base fare" value={`₦${Math.round(trip.price * 0.7).toLocaleString()}`} />
        <Row label="Distance" value={`₦${Math.round(trip.price * 0.2).toLocaleString()}`} />
        <Row label="Time" value={`₦${Math.round(trip.price * 0.1).toLocaleString()}`} />
        <div style={{ height: 1, background: "var(--input-bg)", margin: "10px 0" }} />
        <div className="row-between">
          <span style={{ fontWeight: 700 }}>Total</span>
          <span className="price-display" style={{ fontSize: 20 }}>₦{trip.price.toLocaleString()}</span>
        </div>
      </div>

      <div className="stack" style={{ alignItems: "center", gap: 12, margin: "24px 0" }}>
        <img src={trip.driver.avatar} alt="" width={64} height={64} style={{ borderRadius: "50%" }} />
        <p style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>{trip.driver.name}</p>
        <StarRating value={rating} onChange={setRating} size={36} />
      </div>

      <div className="row" style={{ gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
        {REVIEW_TAGS.map((tag) => (
          <Chip key={tag} active={tags.includes(tag)} onClick={() => toggleTag(tag)}>
            {tag}
          </Chip>
        ))}
      </div>

      <div className="field" style={{ marginBottom: 20 }}>
        <textarea placeholder="Leave a review (optional)" value={review} onChange={(e) => setReview(e.target.value)} />
      </div>

      <Button block onClick={submit}>Submit Rating</Button>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="row-between" style={{ padding: "4px 0" }}>
      <span className="body-text">{label}</span>
      <span style={{ fontSize: 14 }}>{value}</span>
    </div>
  );
}
