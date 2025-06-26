import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import axiosInstance from '@/api/axios';
import Timeline from '@/components/Timeline';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../ui/button';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { toast } from 'sonner'; // Import toast for notifications

const SwapRequestDetailsPage = () => {
  const { id } = useParams(); // Extract swap request ID from URL params
  const { user: currentUser } = useAuth();
  const [swapRequest, setSwapRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [llmSummary, setLlmSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    const fetchSwapRequestDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/swap-requests/${id}`);
        setSwapRequest(response.data);
        console.log("Swap Request Data:", response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSwapRequestDetails();
  }, [id]);

  const handleSummarizeClick = async () => {
    if (!swapRequest) {
      toast.error("No swap request data available to summarize.");
      return;
    }

    setSummarizing(true);
    setLlmSummary(''); // Clear previous summary

    try {
      const response = await axiosInstance.post('/api/llm/summarize-swap-request', { swapRequestData: swapRequest });
      setLlmSummary(response.data.summary);
      toast.success("Swap request summarized successfully!");
    } catch (err) {
      console.error("Error summarizing swap request:", err);
      toast.error("Failed to summarize swap request. Please ensure your GEMINI_API_KEY is configured and the backend server is running.");
    } finally {
      setSummarizing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 bg-gray-100">
        {/* Skeleton for Technical Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <Skeleton className="h-8 w-1/3 mb-4" /> {/* Title skeleton */}
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-1/2 mb-2" /> {/* Subtitle skeleton */}
                <Skeleton className="h-6 w-full" /> {/* Content skeleton */}
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton for My Profile */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <Skeleton className="h-8 w-1/3 mb-4" /> {/* Title skeleton */}
          <div className="flex items-center mb-4">
            <Skeleton className="w-16 h-16 rounded-full mr-4" /> {/* Avatar skeleton */}
            <div>
              <Skeleton className="h-6 w-48 mb-2" /> {/* Name skeleton */}
              <Skeleton className="h-4 w-32" /> {/* Percentage skeleton */}
            </div>
          </div>
          <Skeleton className="h-6 w-2/3 mt-4 mb-4" /> {/* Performance updates title skeleton */}
          <Skeleton className="h-24 w-full" /> {/* Timeline skeleton */}
        </div>

        {/* Skeleton for Skill Swap Partner */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <Skeleton className="h-8 w-1/3 mb-4" /> {/* Title skeleton */}
          <div className="flex items-center mb-4">
            <Skeleton className="w-16 h-16 rounded-full mr-4" /> {/* Avatar skeleton */}
            <div>
              <Skeleton className="h-6 w-48 mb-2" /> {/* Name skeleton */}
              <Skeleton className="h-4 w-32" /> {/* Percentage skeleton */}
            </div>
          </div>
          <Skeleton className="h-6 w-2/3 mt-4 mb-4" /> {/* Performance updates title skeleton */}
          <Skeleton className="h-24 w-full" /> {/* Timeline skeleton */}
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!swapRequest) {
    return <div>Swap request not found.</div>;
  }

  return (
    <div className="container mx-auto py-10 bg-gray-100">
      {/* Technical Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary">Technical Info</h2>
        <Button
          onClick={handleSummarizeClick}
          disabled={summarizing}
          className="mb-4"
        >
          {summarizing ? 'Summarizing...' : 'Summarize with AI'}
        </Button>
        {llmSummary && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">AI Summary:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{llmSummary}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className="font-semibold">Category:</h3>
            <p>
              {swapRequest.serviceCategory && swapRequest.serviceCategory.length > 0
                ? swapRequest.serviceCategory[0].name
                : "N/A"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Skill Offered:</h3>
            <p>{swapRequest.serviceDescription || "N/A"}</p>
          </div>
          <div>
            <h3 className="font-semibold">Skill Requested:</h3>
            <p>
              {swapRequest.serviceCategory && swapRequest.serviceCategory.length > 1
                ? swapRequest.serviceCategory[1].name
                : "N/A"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Service Description:</h3>
            <p>{swapRequest.serviceDescription || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Profiles */}
      {currentUser && swapRequest && (
        <>
          {/* Current User's Profile */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">My Profile</h2>
            <div className="flex items-center mb-4">
              <img
                src={`${import.meta.env.VITE_API_URL}/${swapRequest.createdBy?._id === currentUser.id
                  ? swapRequest.createdBy?.profilePicture
                  : swapRequest.interactionUser?.profilePicture
                  }`}
                alt="Profile"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 className="text-xl font-semibold">
                  {swapRequest.createdBy?._id === currentUser.id
                    ? swapRequest.createdBy?.name || "N/A"
                    : swapRequest.interactionUser?.name || "N/A"}
                </h3>
                {/* Display dynamic percentage for current user */}
                {(() => {
                  const currentUserUpdates = swapRequest.updates
                    .filter(update => update.user?._id === currentUser.id)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                  const latestPercentage = currentUserUpdates.length > 0 ? currentUserUpdates[0].percentage : 0;
                  return <p className="text-gray-600">{latestPercentage}% Completed</p>;
                })()}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mt-4">
                Performance Updates of 1 Month (shown in weekly format)
              </h3>
              <Timeline
                updates={swapRequest.updates
                  .filter(update => update.user?._id === currentUser.id)
                  .map(update => ({
                    title: `${update.title} (${update.percentage}%)`, // Use update.title and percentage
                    date: new Date(update.createdAt).toLocaleDateString(),
                    description: update.message,
                  }))}
              />
            </div>
          </div>

          {/* Other User's Profile */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">Skill Swap Partner</h2>
            <div className="flex items-center mb-4">
              <img
                src={`${import.meta.env.VITE_API_URL}/${swapRequest.createdBy?._id === currentUser.id
                  ? swapRequest.interactionUser?.profilePicture
                  : swapRequest.createdBy?.profilePicture
                  }`}
                alt="Partner Profile"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 className="text-xl font-semibold">
                  {swapRequest.createdBy?._id === currentUser.id
                    ? swapRequest.interactionUser?.name || "N/A"
                    : swapRequest.createdBy?.name || "N/A"}
                  <Button asChild variant="outline" className="ml-2">
                    <Link to={`/add-review/${swapRequest.createdBy?._id === currentUser.id
                      ? swapRequest.interactionUser?._id
                      : swapRequest.createdBy?._id}`}>
                      Add Review
                    </Link>
                  </Button>
                </h3>

                {/* Display dynamic percentage for skill swap partner */}
                {(() => {
                  const partnerUpdates = swapRequest.updates
                    .filter(update =>
                      swapRequest.createdBy?._id === currentUser.id
                        ? update.user?._id === swapRequest.interactionUser?._id
                        : update.user?._id === swapRequest.createdBy?._id
                    )
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                  const latestPercentage = partnerUpdates.length > 0 ? partnerUpdates[0].percentage : 0;
                  return <p className="text-gray-600">{latestPercentage}% Completed</p>;
                })()}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mt-4">
                Performance Updates of 1 Month (shown in weekly format)
              </h3>
              <Timeline
                updates={swapRequest.updates
                  .filter(update =>
                    swapRequest.createdBy?._id === currentUser.id
                      ? update.user?._id === swapRequest.interactionUser?._id
                      : update.user?._id === swapRequest.createdBy?._id
                  )
                  .map(update => ({
                    title: `${update.title} (${update.percentage}%)`, // Use update.title and percentage
                    date: new Date(update.createdAt).toLocaleDateString(),
                    description: update.message,
                  }))}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SwapRequestDetailsPage;
