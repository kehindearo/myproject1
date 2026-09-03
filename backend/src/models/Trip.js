import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    state: String,
    city: String,
    point: String,
    coordinates: { type: [Number], default: undefined }, // [lng, lat]
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    origin: { type: locationSchema, required: true },
    destination: { type: locationSchema, required: true },

    departureAt: { type: Date, required: true, index: true },
    estimatedDurationMins: Number,

    pricePerSeatKobo: { type: Number, required: true, max: 5_000_000 }, // ₦50,000 cap
    tier: { type: String, enum: ["Lite", "Comfort", "XL"], default: "Comfort" },
    seatsTotal: { type: Number, required: true, min: 1, max: 8 },
    seatsAvailable: { type: Number, required: true },

    recurring: { type: String, enum: ["One-time", "Daily", "Weekly"], default: "One-time" },
    notes: String,

    status: {
      type: String,
      enum: ["scheduled", "active", "completed", "cancelled"],
      default: "scheduled",
      index: true,
    },

    surgeApplied: { type: Boolean, default: false },
  },
  { timestamps: true }
);

tripSchema.index({ "origin.state": 1, "destination.state": 1, departureAt: 1 });
tripSchema.index({ status: 1, departureAt: 1 });

export default mongoose.model("Trip", tripSchema);
