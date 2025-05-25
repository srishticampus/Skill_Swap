import mongoose from "mongoose";

const UserRatingSchema = new mongoose.Schema(
  {
    rater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ratedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserRating", UserRatingSchema);