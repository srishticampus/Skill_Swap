import React, { useState, useEffect } from 'react';
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from 'lucide-react';
import axiosInstance from '@/api/axios';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

const ReceivedSwapRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceivedSwapRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token provided');
          setError('No token provided. Please log in.');
          return;
        }

        const response = await axiosInstance.get('/api/received-swap-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch swap requests');
      } finally {
        setLoading(false);
      }
    };

    fetchReceivedSwapRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token provided');
        setError('No token provided. Please log in.');
        return;
      }

      await axiosInstance.put(`/api/swap-request-interactions/${id}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the state to reflect the approved request
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === id ? { ...request, status: 'accepted' } : request
        )
      );

      toast.success("Swap request approved!")
    } catch (err) {
      console.error('Error approving swap request:', err);
      setError(err.message || 'Failed to approve swap request');
      toast.error(err.message || 'Failed to approve swap request')
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token provided');
        setError('No token provided. Please log in.');
        return;
      }

      await axiosInstance.put(`/api/swap-request-interactions/${id}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the state to reflect the rejected request
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === id ? { ...request, status: 'rejected' } : request
        )
      );
      toast.success("Swap request rejected!")
    } catch (err) {
      console.error('Error rejecting swap request:', err);
      setError(err.message || 'Failed to reject swap request');
      toast.error(err.message || 'Failed to reject swap request')
    }
  };

  if (loading) {
    return (
      <section className="mt-10 lg:mt-20 mb-10 p-5">
        <Skeleton className="h-10 w-1/2 mx-auto mb-10" /> {/* Title skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => ( // Show 4 skeleton cards
            <Card key={i} className="bg-white shadow-md rounded-lg overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-evenly mb-4">
                  <Skeleton className="w-32 h-32 rounded-3xl" /> {/* Avatar skeleton */}
                  <div>
                    <Skeleton className="h-6 w-3/4 mb-2" /> {/* Name skeleton */}
                    <Skeleton className="h-4 w-1/2 mb-1" /> {/* Skills skeleton */}
                    <Skeleton className="h-4 w-1/3 mb-1" /> {/* Location skeleton */}
                    <Skeleton className="h-4 w-1/3 mb-2" /> {/* Experience skeleton */}
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Skeleton key={j} className="w-4 h-4 rounded-full mr-1" />
                      ))}
                    </div>
                  </div>
                </div>
                <Skeleton className="h-5 w-2/3 mb-2" /> {/* Service Required title */}
                <Skeleton className="h-8 w-full mb-4" /> {/* Service Required badge */}
                <Skeleton className="h-5 w-2/3 mb-2" /> {/* Service Offered title */}
                <Skeleton className="h-8 w-full mb-4" /> {/* Service Offered badge */}
                <Skeleton className="h-5 w-1/3 mb-2" /> {/* Deadline title */}
                <Skeleton className="h-6 w-1/2 mb-4" /> {/* Deadline text */}
                <div className="flex justify-between">
                  <Skeleton className="h-10 w-24 rounded-full" /> {/* Approve button */}
                  <Skeleton className="h-10 w-24 rounded-full" /> {/* Reject button */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section className="mt-10 lg:mt-20 mb-10 p-5">
      <h1 className="text-3xl font-bold text-primary mb-10 text-center">Received Swap Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {requests.length === 0 ? (
          <p className='text-center my-10 w-full col-span-1 text-gray-500 md:col-span-2 lg:col-span-4'>No requests found</p>
        ) : (
          requests.map((request) => (
            <Card key={request._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-evenly">
                  <Avatar className="w-1/2 aspect-square h-auto rounded-3xl flex items-center justify-center">
                    <AvatarImage className="rounded-3xl" src={`${import.meta.env.VITE_API_URL}/${request.user.profilePicture}`} alt={request.user?.name || 'N/A'} />
                    <AvatarFallback className="w-32 h-32 rounded-full">{request.user?.name ? request.user.name[0] : 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold text-primary">{request.user?.name || 'N/A'}</h2>
                    <p className="text-sm text-gray-500">{request.user?.skills?.join(', ') || 'N/A'}</p>
                    <p className="text-sm text-gray-500">
                      <span className="mr-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin inline-block"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg></span>
                      {request.user.preferredLocation || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="mr-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase inline-block"><rect width="20" height="12" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16" /></svg></span>
                      {request.user.yearsOfExperience ? `${request.user.yearsOfExperience} years` : 'N/A'}
                    </p>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < (request.user.rating || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-md font-semibold text-primary">Service Required</h3>
                  <Badge className="mr-2">{request.swapRequest.serviceRequired || 'N/A'}</Badge>
                </div>
                <div className="mt-4">
                  <h3 className="text-md font-semibold text-primary">Service Offered</h3>
                  <Badge className="mr-2">{request.swapRequest.serviceDetails || 'N/A'}</Badge>
                </div>
                <div className="mt-4">
                  <h3 className="text-md font-semibold text-primary">Deadline</h3>
                  <p className="text-sm text-gray-700">Before 21 April 2025</p>
                </div>
                {request.status === 'pending' ? (
                  <div className="flex justify-between mt-4">
                    <button className="bg-purple-200 text-purple-700 rounded-full px-4 py-2 hover:bg-purple-300" onClick={() => handleApprove(request._id)}>Approve</button>
                    <button className="bg-purple-200 text-purple-700 rounded-full px-4 py-2 hover:bg-purple-300" onClick={() => handleReject(request._id)}>Reject</button>
                  </div>
                ) : (
                  <div className="mt-4 text-center">
                    <h3 className="text-md font-semibold text-primary mb-2">Status</h3>
                    <Badge className={`text-white px-3 py-1 rounded-full text-sm ${
                      request.status === 'accepted' ? 'bg-green-500' :
                      request.status === 'rejected' ? 'bg-red-500' :
                      request.status === 'completed' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  );
};

export default ReceivedSwapRequests;
