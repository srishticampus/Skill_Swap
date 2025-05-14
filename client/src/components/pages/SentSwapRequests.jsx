import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from 'lucide-react';
import axiosInstance from '@/api/axios';

const SentSwapRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSentSwapRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token provided');
          setError('No token provided. Please log in.');
          return;
        }

        const response = await axiosInstance.get('/api/sent-swap-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch swap requests');
      } finally {
        setLoading(false);
      }
    };

    fetchSentSwapRequests();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section className="mt-10 lg:mt-20 mb-10 p-5">
      <h1 className="text-3xl font-bold text-primary mb-10 text-center">View Sent Swap Request</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {requests.map((request) => (
        <Card key={request._id} className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-evenly">
             <Avatar className="w-1/2 aspect-square h-auto rounded-3xl flex items-center justify-center">
                <AvatarImage className="rounded-3xl" src={`${import.meta.env.VITE_API_URL}/${request.createdBy.profilePicture}`} alt={request.createdBy?.name || 'N/A'} />
                <AvatarFallback className="w-32 h-32 rounded-full">{request.createdBy?.name ? request.createdBy.name[0] : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-primary">{request.createdBy?.name || 'N/A'}</h2>
                <p className="text-sm text-gray-500">{request.createdBy?.skills?.join(', ') || 'N/A'}</p>
                <p className="text-sm text-gray-500">
                  <span className="mr-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin inline-block"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span>
                  {request.preferredLocation || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="mr-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase inline-block"><rect width="20" height="12" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16"/></svg></span>
                  {request.yearsOfExperience ? `${request.yearsOfExperience} years` : 'N/A'}
                </p>
                <div className="flex items-center">
                  {/* You might need to adjust this based on how ratings are stored */}
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < (request.rating || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-semibold text-primary">Service Required</h3>
              <Badge className="mr-2">{request.serviceRequired || 'N/A'}</Badge>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-semibold text-primary">Service Description</h3>
              <p className="text-sm text-gray-700">{request.serviceDetails || 'N/A'}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-semibold text-primary">Service Title</h3>
              <p className="text-sm text-gray-700">{request.serviceTitle || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    </section>
  );
};

export default SentSwapRequests;