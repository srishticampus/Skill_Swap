import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axiosInstance from '@/api/axios';

function OrganizationReviews() {
  const { organizationId } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/api/organization/${organizationId}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    fetchReviews();
  }, [organizationId]);

  // Helper to render stars
  const renderStars = (rating) => {
    const totalStars = 5;
    let stars = [];
    for (let i = 0; i < totalStars; i++) {
      if (i < rating) {
        // Full star (using an emoji or icon placeholder)
        stars.push(<span key={i} className="text-yellow-400">&#9733;</span>); // Unicode star
      } else {
        // Empty star (using an emoji or icon placeholder)
        stars.push(<span key={i} className="text-gray-300">&#9733;</span>); // Unicode star
      }
    }
    return <div className="flex">{stars}</div>;
  };


  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Header based on the image */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary">View Review</h2>
      </div>

      {/* Container for review cards */}
      {/* Using grid as seen in the image layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {reviews.map(review => (
          <div key={review._id} className="bg-white rounded-lg p-6 shadow-md">
            {/* Reviewer Info */}
            <div className="flex items-center mb-4">
              {/* Avatar Placeholder */}
              {/* In a real app, use an Image component or proper img tag */}
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex-shrink-0">
                {/* You could place an img tag here */}
                {/* <img src={review.avatarUrl} alt={review.reviewerName} className="w-full h-full rounded-full object-cover" /> */}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary">{review.reviewer.firstName} {review.reviewer.lastName}</h3>
                <p className="text-sm text-gray-600">{review.reviewerSkills}</p>
              </div>
            </div>

            {/* Reviewed For */}
            <p className="text-sm text-gray-500 mb-2">Reviewed for <span className="font-medium text-gray-700">{review.reviewedFor}</span></p>

            {/* Review Text */}
            <p className="text-base italic text-gray-800 mb-4">"{review.reviewText}"</p>

            {/* Rating */}
            {renderStars(review.rating)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrganizationReviews;
