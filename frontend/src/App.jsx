import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import RequireAuth from "./components/RequireAuth";
import PageTransition from "./components/layout/PageTransition";

import Splash from "./screens/splash/Splash";
import Onboarding from "./screens/onboarding/Onboarding";
import Signup from "./screens/auth/Signup";
import Login from "./screens/auth/Login";
import ForgotPassword from "./screens/auth/ForgotPassword";
import RoleSelection from "./screens/auth/RoleSelection";

import RiderHome from "./screens/rider/RiderHome";
import FindRide from "./screens/rider/FindRide";
import TripDetails from "./screens/rider/TripDetails";
import MyTrips from "./screens/rider/MyTrips";
import ActiveTrip from "./screens/rider/ActiveTrip";
import RateTrip from "./screens/rider/RateTrip";
import Profile from "./screens/rider/Profile";

import DriverOnboarding from "./screens/driver/DriverOnboarding";
import DriverHome from "./screens/driver/DriverHome";
import PostTrip from "./screens/driver/PostTrip";
import DriverTrips from "./screens/driver/DriverTrips";
import Earnings from "./screens/driver/Earnings";

import Wallet from "./screens/wallet/Wallet";

import AdminLogin from "./screens/admin/AdminLogin";
import AdminDashboard from "./screens/admin/AdminDashboard";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />

        <Route path="/auth/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/auth/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/auth/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/auth/role-selection" element={<PageTransition><RoleSelection /></PageTransition>} />

        <Route path="/rider/home" element={<RequireAuth role="rider"><PageTransition noPadding><RiderHome /></PageTransition></RequireAuth>} />
        <Route path="/rider/find" element={<RequireAuth role="rider"><PageTransition noPadding><FindRide /></PageTransition></RequireAuth>} />
        <Route path="/rider/trip/:id" element={<RequireAuth role="rider"><PageTransition noPadding><TripDetails /></PageTransition></RequireAuth>} />
        <Route path="/rider/trips" element={<RequireAuth role="rider"><PageTransition noPadding><MyTrips /></PageTransition></RequireAuth>} />
        <Route path="/rider/active/:id" element={<RequireAuth role="rider"><ActiveTrip /></RequireAuth>} />
        <Route path="/rider/rate/:id" element={<RequireAuth role="rider"><PageTransition noPadding><RateTrip /></PageTransition></RequireAuth>} />
        <Route path="/rider/wallet" element={<RequireAuth role="rider"><PageTransition noPadding><Wallet variant="rider" /></PageTransition></RequireAuth>} />
        <Route path="/rider/profile" element={<RequireAuth role="rider"><PageTransition noPadding><Profile variant="rider" /></PageTransition></RequireAuth>} />

        <Route path="/driver/onboarding" element={<RequireAuth role="driver"><PageTransition noPadding><DriverOnboarding /></PageTransition></RequireAuth>} />
        <Route path="/driver/home" element={<RequireAuth role="driver"><PageTransition noPadding><DriverHome /></PageTransition></RequireAuth>} />
        <Route path="/driver/post-trip" element={<RequireAuth role="driver"><PageTransition noPadding><PostTrip /></PageTransition></RequireAuth>} />
        <Route path="/driver/trips" element={<RequireAuth role="driver"><PageTransition noPadding><DriverTrips /></PageTransition></RequireAuth>} />
        <Route path="/driver/earnings" element={<RequireAuth role="driver"><PageTransition noPadding><Earnings /></PageTransition></RequireAuth>} />
        <Route path="/driver/wallet" element={<RequireAuth role="driver"><PageTransition noPadding><Wallet variant="driver" /></PageTransition></RequireAuth>} />
        <Route path="/driver/profile" element={<RequireAuth role="driver"><PageTransition noPadding><Profile variant="driver" /></PageTransition></RequireAuth>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AnimatedRoutes />
    </ErrorBoundary>
  );
}
