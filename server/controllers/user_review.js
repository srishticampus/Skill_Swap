import UserRating from '../models/user_rating.js';
import User from '../models/user.js';

// Create a new user review
export const createReview = async (req, res) => {
  try {
    const { ratedUser, rating, reviewText } = req.body;
    const rater = req.user.id; // Assuming rater is the logged-in user

    const newReview = new UserRating({
      rater,
      ratedUser,
      rating,
      reviewText,
    });

    await newReview.save();

    // If the review is positive (rating 4 or 5), increment positiveReviewsCount for the rated user
    if (rating >= 4) {
      await User.findByIdAndUpdate(ratedUser, { $inc: { positiveReviewsCount: 1 } });
    }

    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all reviews for a specific user
export const getReviewsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await UserRating.find({ ratedUser: userId }).populate('rater', 'username name profilePictureUrl'); // Populate rater details

    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
