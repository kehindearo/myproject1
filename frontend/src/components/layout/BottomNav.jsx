import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  IconHome,
  IconCompass,
  IconList,
  IconWallet,
  IconProfile,
} from "../ui/icons";

const RIDER_TABS = [
  { to: "/rider/home", label: "Home", icon: IconHome },
  { to: "/rider/find", label: "Find Ride", icon: IconCompass },
  { to: "/rider/trips", label: "My Trips", icon: IconList },
  { to: "/rider/wallet", label: "Wallet", icon: IconWallet },
  { to: "/rider/profile", label: "Profile", icon: IconProfile },
];

const DRIVER_TABS = [
  { to: "/driver/home", label: "Home", icon: IconHome },
  { to: "/driver/trips", label: "Trips", icon: IconList },
  { to: "/driver/earnings", label: "Earnings", icon: IconWallet },
  { to: "/driver/profile", label: "Profile", icon: IconProfile },
];

export default function BottomNav({ variant = "rider" }) {
  const tabs = variant === "driver" ? DRIVER_TABS : RIDER_TABS;
  const [tapped, setTapped] = useState(null);

  return (
    <nav
      className="glass-nav"
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "480px",
        height: "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        zIndex: 500,
      }}
      aria-label="Primary"
    >
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setTapped(to)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            minHeight: 48,
            textDecoration: "none",
          }}
        >
          {({ isActive }) => (
            <>
              <motion.span
                animate={tapped === to ? { y: [0, -4, 0] } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                style={{ display: "flex", color: isActive ? "var(--accent)" : "var(--primary)" }}
              >
                <Icon width={22} height={22} strokeWidth={isActive ? 2.4 : 2} />
              </motion.span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  width: isActive ? 4 : 0,
                  height: 4,
                  borderRadius: 4,
                  background: "var(--accent)",
                  transition: "width 200ms ease",
                }}
              />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
