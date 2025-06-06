import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router'; // Import useNavigate and useParams
import { Textarea } from '../ui/textarea'; // Assuming textarea component
import axios from '../../api/axios'; // Import axios instance
import { Button } from '../ui/button'; // Assuming button component
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'; // Assuming avatar component
import { Skeleton } from '../ui/skeleton'; // Import Skeleton component

const AddSwapReview = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { userId } = useParams(); // Get userId from URL parameters

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [ratedUser, setRatedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // New loading state for user
  const [categories, setCategories] = useState([]); // State for fetched categories
  const [loadingCategories, setLoadingCategories] = useState(true); // Loading state for categories

  useEffect(() => {
    const fetchRatedUser = async () => {
      try {
        setLoadingUser(true);
        const response = await axios.get(`/api/auth/users/${userId}`);
        setRatedUser(response.data);
        console.log('Rated User Data:', response.data); // Log the fetched user data
      } catch (error) {
        console.error('Error fetching rated user:', error);
        // Handle error (e.g., show an error message)
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (userId) {
      fetchRatedUser();
      fetchCategories();
    }
  }, [userId]);

  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert('Please provide a rating before submitting.');
      return;
    }

    try {
      const response = await axios.post('/api/user-reviews', {
        ratedUser: userId,
        rating: rating,
        reviewText: reviewText,
      });
      console.log('Review submitted successfully:', response.data);
      // Optionally navigate the user after successful submission
      navigate(-1); // Navigate back to the rated user's profile or a confirmation page
    } catch (error) {
      console.error('Error submitting review:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Button onClick={() => navigate(-1)} className="mb-4"> {/* Back Button */}
        Back
      </Button>
      <h1 className="text-2xl font-bold text-center mb-8 text-purple-700">Add Swap Review</h1>
      {(loadingUser || loadingCategories) ? (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {/* User Info Section Skeleton */}
          <div className="flex items-center mb-6">
            <Skeleton className="h-12 w-12 mr-4 rounded-full" />
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          {/* Review Text Area Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>

          {/* Star Rating Skeleton */}
          <div className="flex items-center mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-6 mr-1 rounded-full" />
            ))}
          </div>

          {/* Submit Button Skeleton */}
          <div className="text-center">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      ) : (
        ratedUser && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            {/* User Info Section */}
            <div className="flex items-center mb-6">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={ratedUser?.profilePictureUrl || '/path/to/default-pfp.jpg'} alt={ratedUser?.name || 'User'} />
                <AvatarFallback>{ratedUser?.name ? ratedUser.name.substring(0, 2).toUpperCase() : 'US'}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{ratedUser?.name}</h2>
                <p className="text-gray-600">{ratedUser?.categories?.map(c => c.name)?.join(', ')}</p>
              </div>
            </div>

            {/* Review Text Area */}
            <div className="mb-6">
              <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                Write a Review here...
              </label>
              <Textarea
                id="review"
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
            </div>

            {/* Star Rating */}
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-6 h-6 cursor-pointer ${index < rating ? 'text-purple-500' : 'text-gray-300'
                    }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  onClick={() => handleStarClick(index)}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.594 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.839.565-1.894-.297-1.594-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                onClick={handleSubmitReview}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AddSwapReview;
