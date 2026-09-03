import { useEffect, useRef, useState } from "react";
import BottomSheet from "../ui/BottomSheet";
import { getSocket } from "../../services/socket";
import { useAuth } from "../../context/AuthContext";
import { IconArrowRight } from "../ui/icons";

const DEMO_REPLIES = [
  "Sure, I'll be there in a few minutes!",
  "Got it, thanks for letting me know.",
  "On my way now 🚗",
  "No problem at all, see you soon.",
];

export default function ChatSheet({ open, onClose, tripId, peerName = "them" }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [live, setLive] = useState(false);
  const listRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!open || !tripId) return;
    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      setLive(true);
      socket.emit("trip:join", tripId);
    };
    const handleConnectError = () => setLive(false);
    const handleMessage = (msg) => {
      if (msg.from === user?.id) return; // already rendered optimistically
      setMessages((m) => [...m, { ...msg, mine: false }]);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("chat:message", handleMessage);
    if (socket.connected) handleConnect();

    return () => {
      socket.emit("trip:leave", tripId);
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("chat:message", handleMessage);
    };
  }, [open, tripId, user?.id]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = () => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { from: user?.id, text: value, at: Date.now(), mine: true }]);
    setText("");

    if (live && socketRef.current) {
      socketRef.current.emit("chat:message", { tripId, text: value });
    } else {
      // No live backend/auth in this session — simulate a reply so the
      // conversation stays interactive in standalone demo mode.
      setTimeout(() => {
        const reply = DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)];
        setMessages((m) => [...m, { from: "peer", text: reply, at: Date.now(), mine: false }]);
      }, 1100);
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={`Chat with ${peerName}`}>
      <div
        ref={listRef}
        className="stack"
        style={{ maxHeight: "50vh", overflowY: "auto", gap: 8, padding: "4px 2px 16px" }}
      >
        {messages.length === 0 && (
          <p className="body-text" style={{ textAlign: "center", padding: "24px 0" }}>
            Say hello 👋{!live && " — demo mode: connect a live backend for real-time delivery"}
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.mine ? "flex-end" : "flex-start", maxWidth: "75%" }}>
            <div
              style={{
                background: m.mine ? "var(--accent)" : "var(--input-bg)",
                color: m.mine ? "#fff" : "var(--text-primary)",
                borderRadius: 16,
                borderBottomRightRadius: m.mine ? 4 : 16,
                borderBottomLeftRadius: m.mine ? 16 : 4,
                padding: "10px 14px",
                fontSize: 14,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="row" style={{ gap: 8 }}>
        <div className="field" style={{ flex: 1 }}>
          <input
            placeholder="Type a message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
        </div>
        <button
          className="btn btn-primary"
          style={{ width: 48, height: 48, borderRadius: "50%", padding: 0, flexShrink: 0 }}
          onClick={send}
          aria-label="Send message"
        >
          <IconArrowRight width={18} height={18} stroke="#fff" style={{ transform: "rotate(-45deg)" }} />
        </button>
      </div>
    </BottomSheet>
  );
}
