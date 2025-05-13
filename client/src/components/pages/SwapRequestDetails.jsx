import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axios';
import { useParams } from 'react-router';

const SwapRequestDetails = () => {
  const { id } = useParams();
  const [swapRequestData, setSwapRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSwapRequest = async () => {
      try {
        const response = await axiosInstance.get(`api/swap-requests/${id}`);
        setSwapRequestData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchSwapRequest();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!swapRequestData) {
    return <div>Swap request not found</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Top Section: User Basic Info */}
      <Card className="mb-8 rounded-lg shadow-md">
        <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start justify-between">
          <div className="flex items-center mb-6 md:mb-0">
            <img
              src={`${import.meta.env.VITE_API_URL}/${swapRequestData?.createdBy?.profilePicture}`}
              alt={swapRequestData?.createdBy?.name}
              className="w-24 h-24 rounded-full object-cover mr-6"
            />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-primary mb-4">{swapRequestData?.createdBy?.name}</h1> {/* Use primary text like in the image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-gray-700">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {swapRequestData?.createdBy?.name}
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zM9 9a1 1 0 100 2 1 1 0 000-2zm2-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg> {/* Placeholder gender icon */}
                {swapRequestData?.createdBy?.gender}
              </div>
               <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {swapRequestData?.createdBy?.email}
              </div>
               <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 8a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg> {/* Placeholder globe icon */}
                {swapRequestData?.createdBy?.location}
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM7 4h6v12H7V4z" clipRule="evenodd" />
                </svg>
                {swapRequestData?.createdBy?.phone}
              </div>
               <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V4a1 1 0 00-1-1H5zM4 4h10v10H4V4z" clipRule="evenodd" />
                </svg> {/* Placeholder building icon */}
                {swapRequestData?.createdBy?.city}
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>

    {/* Bottom Section: Technical Info */}
    <Card className="rounded-lg shadow-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold text-primary mb-6">Technical Info</h2> {/* Use purple text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-gray-700">

          <div>
            <p className="text-gray-500 mb-1">Resume</p>
            <a href="#" className="text-blue-600 hover:underline">{swapRequestData?.resume}</a> {/* Link placeholder */}
          </div>
          <div>
            <p className="text-gray-500 mb-1">Years of Experience</p>
            <p>{swapRequestData?.createdBy?.yearsOfExperience} Years</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Category</p>
            <div className="flex flex-wrap gap-2">
              {swapRequestData?.serviceCategory?.map((cat, index) => (
                 <Badge key={index} variant="outline" className="text-primary border-primary">{cat?.name}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Service Offered</p>
            <Badge variant="outline" className="text-primary border-primary">{swapRequestData?.serviceTitle}</Badge>
          </div>
           <div>
            <p className="text-gray-500 mb-1">Skills</p>
             <div className="flex flex-wrap gap-2">
               {swapRequestData?.skills?.map((skill, index) => (
                 <Badge key={index} variant="outline" className="text-primary border-primary">{skill}</Badge>
               ))}
            </div>
          </div>
           <div>
            <p className="text-gray-500 mb-1">Service Required</p>
             <Badge variant="outline" className="text-primary border-primary">{swapRequestData?.serviceRequired}</Badge>
          </div>
           {/* <div>
            <p className="text-gray-500 mb-1">Senders Name</p>
             <p>{swapRequestData?.senderName}</p>
          </div> */}
           <div>
            <p className="text-gray-500 mb-1">Deadline</p>
            <p>{swapRequestData?.deadline}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500 mb-1">Service Description</p>
            <p>{swapRequestData?.serviceDescription}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
  );
};

export default SwapRequestDetails;
