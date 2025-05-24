import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axiosInstance from '@/api/axios';

const SwapRequestDetailsPage = () => {
  const { id } = useParams(); // Extract swap request ID from URL params
  const [swapRequest, setSwapRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSwapRequestDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/swap-requests/${id}`);
        setSwapRequest(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSwapRequestDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!swapRequest) {
    return <div>Swap request not found.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">Swap Request Details</h1>
      <div className="rounded-md border">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{swapRequest.serviceTitle}</h2>
          <p className="text-gray-600">{swapRequest.serviceDetails}</p>
          <h3 className="text-lg font-semibold mt-4">Updates:</h3>
          {swapRequest.updates && swapRequest.updates.length > 0 ? (
            <ul>
              {swapRequest.updates.map((update) => (
                <li key={update._id} className="py-2">
                  <p className="font-semibold">{update.user.name}:</p>
                  <p>{update.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No updates yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapRequestDetailsPage;