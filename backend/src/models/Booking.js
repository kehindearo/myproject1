import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true, index: true },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    seats: { type: Number, required: true, min: 1 },
    amountKobo: { type: Number, required: true },
    negotiatedPriceKobo: Number,

    paymentMethod: { type: String, enum: ["wallet", "card", "bank_transfer", "ussd"], default: "wallet" },
    paymentStatus: { type: String, enum: ["pending", "paid", "refunded", "failed"], default: "pending" },
    paymentReference: String,

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
      index: true,
    },
    cancellationFeeKobo: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bookingSchema.index({ trip: 1, rider: 1 });

export default mongoose.model("Booking", bookingSchema);
