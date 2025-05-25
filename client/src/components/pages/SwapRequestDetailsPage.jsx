import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axiosInstance from '@/api/axios';
import Timeline from '@/components/Timeline';

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
        console.log("Swap Request Data:", response.data);
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
    <div className="container mx-auto py-10 bg-gray-100">
      {/* Technical Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary">Technical Info</h2>
        <div className="grid grid-cols-2 gap-4">
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

      {/* My Profile */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary">My Profile</h2>
        <div className="flex items-center mb-4">
          <img
            src={`${import.meta.env.VITE_API_URL}/${swapRequest?.createdBy?.profilePicture}`}
            alt="Profile"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h3 className="text-xl font-semibold">{swapRequest.createdBy?.name || "N/A"}</h3>
            <p className="text-gray-600">25% Completed</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mt-4">
            Performance Updates of 1 Month (shown in weekly format)
          </h3>
          <Timeline
            updates={[
              { title: 'Theory Session Completed', date: '26 March 2025', description: 'Completed the initial theory session' },
              { title: 'Introduction Completed', date: '2 April 2025', description: 'Introduction to the project' },
              { title: 'Tools Completed', date: '9 April 2025', description: 'Setup required tools' },
              { title: 'Designing Started', date: '16 April 2025', description: 'Started designing the UI' },
            ]}
          />
        </div>
      </div>

      {/* Skill Swap Partners */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary">Skill Swap Partners</h2>
        <div className="flex items-center mb-4">
          <img
            src={`${import.meta.env.VITE_API_URL}/${swapRequest.interactionUser.profilePicture}`}

            alt="Partner Profile"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h3 className="text-xl font-semibold">{swapRequest.interactionUser.name || "N/A"}</h3>
            <p className="text-gray-600">25% Completed</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mt-4">
            Performance Updates of 1 Month (shown in weekly format)
          </h3>
          <Timeline
            updates={[
              { title: 'Theory Session Completed', date: '26 March 2025', description: 'Completed the initial theory session' },
              { title: 'Introduction Completed', date: '2 April 2025', description: 'Introduction to the project' },
              { title: 'Tools Completed', date: '9 April 2025', description: 'Setup required tools' },
              { title: 'Designing Started', date: '16 April 2025', description: 'Started designing the UI' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default SwapRequestDetailsPage;