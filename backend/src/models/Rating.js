import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    rater: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ratee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    tags: [String],
    review: String,
  },
  { timestamps: true }
);

export default mongoose.model("Rating", ratingSchema);
