export const NIGERIAN_STATES = [
  "Lagos", "Abuja (FCT)", "Rivers", "Oyo", "Kano", "Kaduna", "Enugu", "Delta",
  "Edo", "Ogun", "Anambra", "Cross River", "Plateau", "Osun", "Imo",
];

export const AVATAR = (seed) => `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`;

export const MOCK_DRIVERS = [
  {
    id: "d1",
    name: "Ahmed Bello",
    avatar: AVATAR("Ahmed"),
    rating: 4.8,
    trips: 127,
    verified: true,
    car: "Toyota Camry",
    plate: "ABC 123 XY",
    color: "Silver",
    memberSince: "Jan 2023",
    responseRate: 98,
    online: true,
  },
  {
    id: "d2",
    name: "Ngozi Umeh",
    avatar: AVATAR("Ngozi"),
    rating: 4.9,
    trips: 312,
    verified: true,
    car: "Chevrolet Malibu",
    plate: "KJA 456 GH",
    color: "Black",
    memberSince: "Mar 2022",
    responseRate: 99,
    online: true,
  },
  {
    id: "d3",
    name: "Tunde Adisa",
    avatar: AVATAR("Tunde"),
    rating: 4.6,
    trips: 64,
    verified: true,
    car: "Honda Accord",
    plate: "LSD 789 KL",
    color: "Blue",
    memberSince: "Aug 2023",
    responseRate: 91,
    online: false,
  },
];

export const MOCK_TRIPS = [
  {
    id: "t1",
    from: "Lagos",
    fromDetail: "Ikeja, Lagos",
    to: "Abuja",
    toDetail: "Wuse, Abuja",
    date: "Today",
    time: "8:00 AM",
    duration: "6h 30m",
    price: 15000,
    seatsTotal: 4,
    seatsLeft: 3,
    driver: MOCK_DRIVERS[0],
    tier: "Comfort",
  },
  {
    id: "t2",
    from: "Lagos",
    fromDetail: "Lekki Phase 1",
    to: "Port Harcourt",
    toDetail: "GRA, Port Harcourt",
    date: "Today",
    time: "10:30 AM",
    duration: "7h 15m",
    price: 18500,
    seatsTotal: 4,
    seatsLeft: 1,
    driver: MOCK_DRIVERS[1],
    tier: "XL",
  },
  {
    id: "t3",
    from: "Abuja",
    fromDetail: "Garki",
    to: "Kaduna",
    toDetail: "Sabon Gari",
    date: "Tomorrow",
    time: "6:00 AM",
    duration: "2h 10m",
    price: 6000,
    seatsTotal: 4,
    seatsLeft: 4,
    driver: MOCK_DRIVERS[2],
    tier: "Lite",
  },
  {
    id: "t4",
    from: "Lagos",
    fromDetail: "Yaba",
    to: "Ibadan",
    toDetail: "Bodija",
    date: "Today",
    time: "2:00 PM",
    duration: "1h 45m",
    price: 4500,
    seatsTotal: 4,
    seatsLeft: 2,
    driver: MOCK_DRIVERS[0],
    tier: "Lite",
  },
];

export const MOCK_MY_TRIPS = {
  upcoming: [
    { ...MOCK_TRIPS[0], status: "upcoming", seatsBooked: 1 },
  ],
  active: [],
  past: [
    { ...MOCK_TRIPS[2], status: "past", seatsBooked: 2, date: "Aug 20" },
    { ...MOCK_TRIPS[3], status: "cancelled", seatsBooked: 1, date: "Aug 12" },
  ],
};

export const RECENT_ROUTES = [
  { from: "Lagos", to: "Abuja" },
  { from: "Lagos", to: "Ibadan" },
  { from: "Abuja", to: "Kaduna" },
];

export const REVIEW_TAGS = ["Great driver", "Clean car", "On time", "Safe driver", "Friendly"];

export const TRANSACTIONS = [
  { id: "tx1", type: "credit", title: "Wallet Top Up", date: "Sep 2, 2026", amount: 20000 },
  { id: "tx2", type: "debit", title: "Trip: Lagos → Ibadan", date: "Sep 1, 2026", amount: -4500 },
  { id: "tx3", type: "credit", title: "Referral Bonus", date: "Aug 29, 2026", amount: 1000 },
  { id: "tx4", type: "withdrawal", title: "Withdrawal to GTBank", date: "Aug 25, 2026", amount: -10000 },
];

export const NIGERIAN_BANKS = [
  "Access Bank", "GTBank", "Zenith Bank", "First Bank", "UBA", "Fidelity Bank",
  "Union Bank", "Sterling Bank", "Wema Bank", "Polaris Bank", "Stanbic IBTC",
  "Ecobank", "Kuda Bank", "Opay", "PalmPay", "Moniepoint",
];
