import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["flat", "percent"], required: true },
    value: { type: Number, required: true },
    maxUses: { type: Number, default: null },
    uses: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    expiresAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("PromoCode", promoCodeSchema);
