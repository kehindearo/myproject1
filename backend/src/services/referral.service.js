import Booking from "../models/Booking.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const REFERRAL_BONUS_KOBO = 100_000; // ₦1,000

/**
 * Credits ₦1,000 to both the referred rider and their referrer the first
 * time the rider completes a trip. Idempotent via a per-rider transaction
 * reference, so it's safe to call on every completed booking.
 */
export async function maybeAwardReferralBonus(rider) {
  if (!rider?.referredBy) return;

  const completedCount = await Booking.countDocuments({ rider: rider._id, status: "completed" });
  if (completedCount !== 1) return; // only fires on the rider's first completed trip

  const reference = `referral_${rider._id}`;
  const alreadyAwarded = await Transaction.findOne({ reference });
  if (alreadyAwarded) return;

  const referrer = await User.findById(rider.referredBy);
  if (!referrer) return;

  rider.walletBalanceKobo += REFERRAL_BONUS_KOBO;
  referrer.walletBalanceKobo += REFERRAL_BONUS_KOBO;
  await Promise.all([rider.save(), referrer.save()]);

  await Transaction.insertMany([
    {
      user: rider._id,
      type: "credit",
      amountKobo: REFERRAL_BONUS_KOBO,
      description: "Referral bonus — welcome to Collabo Travel",
      reference,
    },
    {
      user: referrer._id,
      type: "credit",
      amountKobo: REFERRAL_BONUS_KOBO,
      description: `Referral bonus — ${rider.fullName} completed their first trip`,
      reference: `referral_by_${rider._id}`,
    },
  ]);
}
