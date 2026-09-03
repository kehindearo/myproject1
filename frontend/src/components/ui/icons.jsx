/* Lightweight inline SVG icon set — no external icon library dependency. */

const base = (props) => ({
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  ...props,
});

export const IconMail = (p) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

export const IconLock = (p) => (
  <svg {...base(p)}>
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

export const IconEye = (p) => (
  <svg {...base(p)}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconEyeOff = (p) => (
  <svg {...base(p)}>
    <path d="M17.9 17.9A9.6 9.6 0 0 1 12 20c-6.5 0-10-8-10-8a17.6 17.6 0 0 1 4.2-5.2M9.9 4.2A9.5 9.5 0 0 1 12 4c6.5 0 10 8 10 8a17.7 17.7 0 0 1-2.3 3.3" />
    <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2" />
    <path d="M1 1l22 22" />
  </svg>
);

export const IconUser = (p) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);

export const IconPhone = (p) => (
  <svg {...base(p)}>
    <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2C9.5 21 3 14.5 3 6a2 2 0 0 1 1-2z" />
  </svg>
);

export const IconSearch = (p) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const IconBell = (p) => (
  <svg {...base(p)}>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);

export const IconArrowLeft = (p) => (
  <svg {...base(p)}>
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

export const IconArrowRight = (p) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

export const IconChevronRight = (p) => (
  <svg {...base(p)}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const IconHome = (p) => (
  <svg {...base(p)}>
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10h14V10" />
  </svg>
);

export const IconCompass = (p) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8l-2.5 6.5L8 17l2.5-6.5z" />
  </svg>
);

export const IconList = (p) => (
  <svg {...base(p)}>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <circle cx="3.5" cy="6" r="1" fill="currentColor" />
    <circle cx="3.5" cy="12" r="1" fill="currentColor" />
    <circle cx="3.5" cy="18" r="1" fill="currentColor" />
  </svg>
);

export const IconWallet = (p) => (
  <svg {...base(p)}>
    <rect x="2" y="6" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
    <circle cx="17" cy="15" r="1.4" fill="currentColor" />
  </svg>
);

export const IconProfile = (p) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
);

export const IconCar = (p) => (
  <svg {...base(p)}>
    <path d="M3 13l1.5-5A2 2 0 0 1 6.4 6.5h11.2A2 2 0 0 1 19.5 8L21 13" />
    <rect x="2" y="13" width="20" height="6" rx="2" />
    <circle cx="7" cy="19" r="1.5" fill="currentColor" />
    <circle cx="17" cy="19" r="1.5" fill="currentColor" />
  </svg>
);

export const IconShield = (p) => (
  <svg {...base(p)}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const IconStar = ({ filled, ...p }) => (
  <svg {...base(p)} fill={filled ? "#F59E0B" : "none"} stroke={filled ? "#F59E0B" : "currentColor"}>
    <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5-4.9 6.9-1z" />
  </svg>
);

export const IconPin = (p) => (
  <svg {...base(p)}>
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const IconFlag = (p) => (
  <svg {...base(p)}>
    <path d="M5 3v18" />
    <path d="M5 4h13l-3 4 3 4H5" />
  </svg>
);

export const IconChat = (p) => (
  <svg {...base(p)}>
    <path d="M21 12a8 8 0 1 1-3.5-6.6L21 4l-1.2 4A8 8 0 0 1 21 12z" />
  </svg>
);

export const IconShare = (p) => (
  <svg {...base(p)}>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="19" r="2.5" />
    <path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6" />
  </svg>
);

export const IconPlus = (p) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = (p) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);

export const IconCheck = (p) => (
  <svg {...base(p)}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const IconClock = (p) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

export const IconCalendar = (p) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const IconMoney = (p) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2 0 0 1 5 0c0 1.5-2.5 1.5-2.5 3M12 16v.5" />
  </svg>
);
