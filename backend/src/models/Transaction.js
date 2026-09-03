import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["credit", "debit", "withdrawal"], required: true },
    amountKobo: { type: Number, required: true },
    description: { type: String, required: true },
    reference: { type: String, unique: true, sparse: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "success" },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Transaction", transactionSchema);
