import mongoose from "mongoose";

const driverProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    vehicle: {
      make: String,
      model: String,
      year: String,
      color: String,
      plate: { type: String, uppercase: true },
      type: { type: String, enum: ["Lite", "Comfort", "XL"], default: "Comfort" },
    },

    documents: {
      photoUrl: String,
      licenseFrontUrl: String,
      licenseBackUrl: String,
      registrationUrl: String,
      insuranceUrl: String,
    },

    bankDetails: {
      bankName: String,
      accountName: String,
      accountNumber: String,
    },

    approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    rejectionReason: String,

    rating: { type: Number, default: 5, min: 0, max: 5 },
    totalTrips: { type: Number, default: 0 },
    responseRate: { type: Number, default: 100 },

    online: { type: Boolean, default: false },
    currentLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },

    autoAccept: { type: Boolean, default: false },
  },
  { timestamps: true }
);

driverProfileSchema.index({ currentLocation: "2dsphere" });

export default mongoose.model("DriverProfile", driverProfileSchema);
