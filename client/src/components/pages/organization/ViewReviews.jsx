import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

// Updated review structure based on the design
// {
//   id: string;
//   reviewerName: string;
//   reviewerSkills: string; // e.g., "Python, Java"
//   reviewerAvatarUrl?: string;
//   rating: number; // 1-5
//   comment: string;
//   swapTitle: string; // The skill/topic reviewed
// }

const dummyReviews = [
  {
    id: '1',
    reviewerName: 'Nikitha',
    reviewerSkills: 'Python, Java',
    reviewerAvatarUrl: 'https://github.com/shadcn.png', // Replace with actual avatar URL
    rating: 4,
    comment: 'Awesome Experience, Great Class Session',
    swapTitle: 'Web Development',
  },
  {
    id: '2',
    reviewerName: 'Akshay',
    reviewerSkills: 'Python, Java',
    reviewerAvatarUrl: 'https://github.com/shadcn.png', // Replace with actual avatar URL
    rating: 4,
    comment: 'Awesome Experience, Great Class Session',
    swapTitle: 'Web Development',
  },
    {
    id: '3',
    reviewerName: 'Nikitha',
    reviewerSkills: 'Python, Java',
    reviewerAvatarUrl: 'https://github.com/shadcn.png', // Replace with actual avatar URL
    rating: 4,
    comment: 'Awesome Experience, Great Class Session',
    swapTitle: 'Web Development',
  },
  {
    id: '4',
    reviewerName: 'Akshay',
    reviewerSkills: 'Python, Java',
    reviewerAvatarUrl: 'https://github.com/shadcn.png', // Replace with actual avatar URL
    rating: 4,
    comment: 'Awesome Experience, Great Class Session',
    swapTitle: 'Web Development',
  },
  // Add more dummy data as needed to match the grid layout in the design
];

export default function ViewReviews() {
  // In a real application, you would fetch reviews from an API
  const reviews = dummyReviews; // Replace with fetched data

  return (
    <div className="p-6 bg-[#F6F7F9] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#6B46C1]">View Swap Review</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage src={review.reviewerAvatarUrl} alt={review.reviewerName} />
                  <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg text-[#6B46C1]">{review.reviewerName}</CardTitle>
                  <p className="text-sm text-gray-600">{review.reviewerSkills}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-sm text-gray-700 mb-2">Reviewed for <span className="font-semibold">{review.swapTitle}</span></p>
                <p className="text-gray-800 italic mb-2">"{review.comment}"</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
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