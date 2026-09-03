# Collabo Travel

**Your Ride, Your Community**

A ride-hailing platform launching in Nigeria, architected to scale across Africa and beyond. Three roles — Rider, Driver, Admin — one shared design system.

## Monorepo layout

```
collabo-travel/
├── frontend/     React (Vite) mobile-first PWA — riders, drivers, and the admin panel
├── backend/      Node.js + Express API — MongoDB, Redis, Socket.io, payment/notification providers
└── package.json  npm workspaces root
```

## Quick start

```bash
# Frontend (works standalone — falls back to a local simulation if the API is unreachable)
cd frontend
npm install
npm run dev            # http://localhost:5173

# Backend (needs MongoDB + Redis; both degrade gracefully if absent in dev)
cd backend
cp .env.example .env   # fill in real provider keys when you have them
npm install
npm run dev             # http://localhost:4000

# First admin account
npm run seed:admin -- admin@collabotravel.com "Str0ngPassw0rd!"
```

## What's real vs. stubbed

Everything is wired end-to-end with production-shaped code — routes, models, auth, real-time
events, provider interfaces — but a handful of things need **your** credentials to go fully live
(see `backend/.env.example` for every key):

| Capability | Without keys configured | With keys configured |
|---|---|---|
| Email OTP | Logged to server console (`[mailer:dev]`) | Sent via SMTP (`SMTP_*`) |
| SMS (SOS, trip alerts) | Logged to console (`[sms:dev]`) | Sent via Termii |
| Push notifications | Logged to console (`[push:dev]`) | Sent via Firebase Cloud Messaging |
| Payments (top-up, booking, payout) | Simulated success | Monnify (primary) → Paystack (backup) → Stripe (non-NGN currencies) |
| Document/photo storage | Returns the input unchanged | Uploaded + compressed via Cloudinary |
| Google OAuth | Button shows an informational toast | Wire `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` and swap in a real OAuth flow |
| Google Maps (live tracking, geocoding, routing) | Stylized in-app SVG map placeholder | Swap `ActiveTrip.jsx`'s SVG for the Maps JS SDK using `GOOGLE_MAPS_API_KEY` |

The frontend also runs entirely standalone against an in-memory mock/demo layer
(`src/context/AuthContext.jsx`, `src/data/mockData.js`) so the full UI is reviewable without the
backend running at all — every real API call is attempted first and only falls back to the
simulation on failure, so pointing `VITE_API_URL` at a live backend switches it over with no code
changes.

## Design system

Poppins throughout, CSS custom properties for every color/spacing/shadow token (see
`frontend/src/styles/variables.css`), glassmorphism reserved for floating/overlay surfaces, a
shared button/input/card component library (`frontend/src/components/ui/`), and dark mode driven
by a single `data-theme` attribute plus `prefers-color-scheme` fallback.

## What beats Uber

Fare negotiation (rider↔driver bidding), a 10% platform commission (vs. 25%), combined
intercity + city trips, recurring trips, trusted-contacts auto-SMS, in-app chat, visual seat
selection, tagged reviews, driver-sees-earnings-before-accepting, ₦1,000 mutual referral bonus,
admin promo codes, and a carbon-footprint-ready trip model — see `backend/src/services/` and the
rider/driver screens for where each lives.

## Scaling notes

- Redis-backed trip-search caching (`GET /api/v1/trips`) with automatic invalidation on new posts.
- Geo-indexed driver locations (`DriverProfile.currentLocation`, 2dsphere) for nearest-driver matching.
- Socket.io rooms scoped per trip (`trip:<id>`) and per driver (`driver:<id>`) — no cross-trip broadcast.
- Every user-facing amount is stored in kobo/cents (`*Kobo` fields) to avoid floating-point drift;
  `frontend/src/utils/currency.js` formats for `NGN`/`USD`/`GBP`/`EUR`/`GHS`/`KES`.
- UI copy lives in `frontend/src/i18n/*.json` (English, Yorùbá, Igbo, Hausa, French) behind
  `useI18n()` — extend the dictionaries and it's live everywhere that calls `t()`.
- PWA: `frontend/public/manifest.json` + `frontend/public/sw.js` (installable, offline app shell,
  network-first API caching).
