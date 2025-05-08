import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axiosInstance from '@/api/axios'; // Import axiosInstance
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading state

const ExchangeSkills = () => {
  const [swapRequests, setSwapRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSwapRequests = async () => {
      try {
        const response = await axiosInstance.get('/api/swap-requests'); // Adjust endpoint as needed
        setSwapRequests(response.data);
        console.log(response.data)
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchSwapRequests();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Exchange Skills</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="rounded-lg shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Skeleton className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between text-sm mb-4">
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
                <div className="flex justify-between gap-2">
                  <Skeleton className="h-10 flex-grow" />
                  <Skeleton className="h-10 flex-grow" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Exchange Skills</h1>
        <p className="text-red-500">Error fetching swap requests: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Exchange Skills</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Search Skills you Searching For...."
          className="flex-grow"
        />
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Search</Button>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Service Required" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="web-designing">Web Designing</SelectItem>
            <SelectItem value="testing">Testing</SelectItem>
          </SelectContent>
        </Select>
         <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Any Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="programming">Programming</SelectItem>
            <SelectItem value="design">Design</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Skill Exchange Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {swapRequests.map((request) => (
          <Card key={request._id} className="rounded-lg shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={request.createdBy?.profilePicture ? `${import.meta.env.VITE_API_URL}/${request.createdBy.profilePicture}` : '/src/assets/profile-pic.png'} // Use actual profile picture or placeholder
                  alt={request.createdBy?.name || 'N/A'}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold">{request.createdBy?.name || 'N/A'}</h2>
                  <p className="text-gray-600">{request.createdBy?.skills?.join(', ') || 'N/A'}</p> {/* Assuming skills is an array */}
                </div>
              </div>
              <div className="text-gray-700 mb-4">
                <p className="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {request.createdBy?.location || 'N/A'}
                </p>
                <p className="flex items-center mb-1">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                   </svg>
                  {request.createdBy?.yearsOfExperience ? `${request.createdBy.yearsOfExperience} years of experience` : 'N/A'}
                </p>
                 {/* Rating display - needs adjustment based on actual data structure */}
              </div>
              <div className="flex justify-between text-sm mb-4">
                <div>
                  <p className="text-gray-500">Service required</p>
                  <Badge variant="outline" className="text-primary border-primary">{request.serviceRequired || 'N/A'}</Badge>
                </div>
                <div>
                  <p className="text-gray-500">Service Offered</p>
                   <Badge variant="outline" className="text-primary border-primary">{request.serviceTitle || 'N/A'}</Badge>
                </div>
              </div>
              <div className="flex justify-between gap-2">
                <Button variant="outline" className="flex-grow border-primary text-primary hover:bg-primary/10">View Details</Button>
                <Button className="flex-grow bg-primary text-primary-foreground hover:bg-primary/90">Place a Request</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExchangeSkills;