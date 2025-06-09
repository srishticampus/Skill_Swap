import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { useEffect, useState, useContext } from 'react';
import AuthContext from '@/context/AuthContext';
import api from '@/api/axios';

export default function ViewReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchReviews = async () => {
      try {

        const response = await api.get(`/api/organizations/${user.id}/reviews`);
        setReviews(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (user) {
      fetchReviews();
    } else {
      setLoading(false);
      setError("Organization not found. Please login.");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 bg-[#F6F7F9] min-h-screen">
        <Skeleton className="h-8 w-1/3 mb-6 mx-auto" /> {/* For "View Swap Review" title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardHeader>
              <CardContent className="pt-2 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  return (
    <div className="p-6 bg-[#F6F7F9] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#6B46C1]">View Swap Review</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage src={`${import.meta.env.VITE_API_URL}/${review.reviewerAvatarUrl}`} alt={review.reviewerName} />
                  <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg text-[#6B46C1]">{review.reviewerName}</CardTitle>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Rated:</span> {review.ratedUserName}
                  </p>
                  <p className="text-sm text-gray-600">{review.reviewerSkills}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                {/* Removed swapTitle as per user's request */}
                <p className="text-gray-800 italic mb-2">"{review.comment}"</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No reviews available yet.</p>
        )}
      </div>
    </div>
  );
}
