import { env } from "../config/env.js";

/** True during configured peak windows (6–9am, 5–9pm by default). */
export function isSurgeWindow(date = new Date()) {
  const hour = date.getHours();
  return env.surgeWindows.some((w) => hour >= w.start && hour < w.end);
}

export function applySurge(baseFareKobo, date = new Date()) {
  const surging = isSurgeWindow(date);
  return {
    fareKobo: surging ? Math.round(baseFareKobo * env.surgeMultiplier) : baseFareKobo,
    surgeApplied: surging,
    multiplier: surging ? env.surgeMultiplier : 1,
  };
}

/** Platform commission (10%) vs driver payout (90%) split for a completed fare. */
export function splitCommission(fareKobo) {
  const commissionKobo = Math.round(fareKobo * env.commissionRate);
  return { commissionKobo, driverPayoutKobo: fareKobo - commissionKobo };
}

const CANCELLATION_GRACE_HOURS = 2;
const LATE_CANCELLATION_FEE_KOBO = 50_000; // ₦500

export function computeCancellationFee(departureAt, now = new Date()) {
  const hoursUntilDeparture = (new Date(departureAt).getTime() - now.getTime()) / 36e5;
  return hoursUntilDeparture >= CANCELLATION_GRACE_HOURS ? 0 : LATE_CANCELLATION_FEE_KOBO;
}
