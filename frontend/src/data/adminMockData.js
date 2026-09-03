import { MOCK_TRIPS } from "./mockData";

export const ADMIN_STATS = {
  totalRiders: 48213,
  totalDrivers: 6104,
  activeTripsNow: 312,
  totalRevenue: 184_500_000,
  todayRevenue: 2_340_000,
};

export const REVENUE_SERIES = [
  { label: "Mon", value: 1.8 },
  { label: "Tue", value: 2.1 },
  { label: "Wed", value: 1.6 },
  { label: "Thu", value: 2.6 },
  { label: "Fri", value: 3.4 },
  { label: "Sat", value: 3.9 },
  { label: "Sun", value: 2.3 },
];

export const PENDING_DRIVERS = [
  { id: "p1", name: "Grace Adeyemi", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Grace", car: "Kia Rio 2019", submitted: "2h ago" },
  { id: "p2", name: "Ibrahim Sule", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Ibrahim", car: "Toyota Corolla 2020", submitted: "5h ago" },
  { id: "p3", name: "Blessing Eze", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Blessing2", car: "Hyundai Elantra 2018", submitted: "1d ago" },
];

export const ALL_TRIPS_TABLE = MOCK_TRIPS.map((t, i) => ({
  id: t.id,
  route: `${t.from} → ${t.to}`,
  driver: t.driver.name,
  rider: ["Chidinma O.", "Emeka N.", "Fatima Y.", "Segun A."][i],
  status: ["Active", "Completed", "Scheduled", "Completed"][i],
  amount: t.price,
  date: t.date,
}));

export const USERS_TABLE = [
  { id: "u1", name: "Chidinma Okeke", email: "chidinma@example.com", role: "Rider", status: "Active" },
  { id: "u2", name: "Ahmed Bello", email: "ahmed@example.com", role: "Driver", status: "Active" },
  { id: "u3", name: "Emeka Nwosu", email: "emeka@example.com", role: "Rider", status: "Suspended" },
  { id: "u4", name: "Ngozi Umeh", email: "ngozi@example.com", role: "Driver", status: "Active" },
];

export const FLAGGED_REPORTS = [
  { id: "r1", type: "SOS Alert", user: "Fatima Yusuf", detail: "Trip #t2 — emergency triggered", status: "Investigating", severity: "critical" },
  { id: "r2", type: "Rude Behavior", user: "Segun Alade", detail: "Reported driver Tunde Adisa", status: "Open", severity: "medium" },
  { id: "r3", type: "Payment Issue", user: "Chidinma Okeke", detail: "Double charge on wallet top-up", status: "Resolved", severity: "low" },
];

export const PROMO_CODES = [
  { code: "WELCOME1000", discount: "₦1,000 off", uses: 342, active: true },
  { code: "WEEKEND20", discount: "20% off", uses: 981, active: true },
  { code: "LAUNCH2025", discount: "₦500 off", uses: 5023, active: false },
];
