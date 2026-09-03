import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Rating from "../models/Rating.js";
import DriverProfile from "../models/DriverProfile.js";
import Trip from "../models/Trip.js";

export const submitRating = asyncHandler(async (req, res) => {
  const { tripId, stars, tags, review } = req.body;
  if (!tripId || !stars) throw new ApiError(400, "tripId and stars are required");

  const trip = await Trip.findById(tripId);
  if (!trip) throw new ApiError(404, "Trip not found");

  const rating = await Rating.create({
    trip: tripId,
    rater: req.user._id,
    ratee: trip.driver,
    stars,
    tags,
    review,
  });

  const agg = await Rating.aggregate([
    { $match: { ratee: trip.driver } },
    { $group: { _id: null, avg: { $avg: "$stars" }, count: { $sum: 1 } } },
  ]);

  if (agg[0]) {
    await DriverProfile.updateOne({ user: trip.driver }, { rating: agg[0].avg, $inc: { totalTrips: 0 } });
  }

  res.status(201).json({ success: true, rating });
});

export const driverRatings = asyncHandler(async (req, res) => {
  const ratings = await Rating.find({ ratee: req.params.driverId }).populate("rater", "fullName avatarUrl").sort({ createdAt: -1 });
  res.json({ success: true, ratings });
});
