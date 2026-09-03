import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
    type: {
      type: String,
      enum: ["sos", "wrong_route", "rude_behavior", "payment_issue", "safety_concern", "car_condition", "other"],
      required: true,
    },
    detail: String,
    severity: { type: String, enum: ["low", "medium", "critical"], default: "medium" },
    status: { type: String, enum: ["open", "investigating", "resolved"], default: "open", index: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: [Number],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
