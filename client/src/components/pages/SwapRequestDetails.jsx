import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Globe, Smartphone, Building, CircleUser } from 'lucide-react';
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

  const displayUser = swapRequestData?.createdBy || swapRequestData?.interactionUser;

  if (!displayUser) {
    return <div>User information not available for this swap request.</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Top Section: User Basic Info */}
      <Card className="mb-8 rounded-lg shadow-md">
        <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start justify-between">
          <div className="flex items-center mb-6 md:mb-0">
            <img
              src={`${import.meta.env.VITE_API_URL}/${displayUser?.profilePicture}`}
              alt={displayUser?.name}
              className="w-24 h-24 rounded-full object-cover mr-6"
            />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-primary mb-4">{displayUser?.name}</h1> {/* Use primary text like in the image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-gray-700">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-500" />
                {displayUser?.name}
              </div>
              <div className="flex items-center">
                <CircleUser className="h-5 w-5 mr-2 text-gray-500" /> {/* Placeholder gender icon */}
                {displayUser?.gender}
              </div>
               <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-500" />
                {displayUser?.email}
              </div>
               <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-gray-500" /> {/* Placeholder globe icon */}
                {displayUser?.country}
              </div>
              <div className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2 text-gray-500" />
                {displayUser?.phone}
              </div>
               <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-gray-500" /> {/* Placeholder building icon */}
                {displayUser?.city}
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
            <a href={`${import.meta.env.VITE_API_URL}/${displayUser?.resume}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">View Resume</a> {/* Link placeholder */}
          </div>
          <div>
            <p className="text-gray-500 mb-1">Years of Experience</p>
            <p>{displayUser?.yearsOfExperience} Years</p>
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
               {displayUser?.skills?.map((skill, index) => (
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
