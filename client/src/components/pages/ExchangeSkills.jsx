import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axiosInstance from '@/api/axios'; // Import axiosInstance
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading state
import { Link } from 'react-router';
import { toast } from "sonner"

const ExchangeSkills = () => {
  const [swapRequests, setSwapRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingRequest, setPlacingRequest] = useState(false); // Track if a request is being placed
  const [isFiltering, setIsFiltering] = useState(false); // Add filtering state
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceRequiredFilter, setServiceRequiredFilter] = useState('any');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('any');
  const [categories, setCategories] = useState([]); // State to store categories for filter

  // Effect to fetch categories only once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/api/categories'); // Assuming an endpoint for categories
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means run only on mount

  // Effect to fetch swap requests based on search/filter changes
  useEffect(() => {
    const fetchSwapRequests = async () => {
      // Use isFiltering for subsequent fetches (filtering/searching)
      setIsFiltering(true);
      setError(null); // Clear previous errors

      try {
        const params = {};
        if (searchTerm) {
          params.searchTerm = searchTerm;
        }
        if (serviceRequiredFilter !== 'any') {
          params.serviceRequired = serviceRequiredFilter;
        }
        if (serviceCategoryFilter !== 'any') {
           params.serviceCategory = serviceCategoryFilter;
        }

        const response = await axiosInstance.get('/api/swap-requests', { params }); // Pass params as query parameters
        setSwapRequests(response.data);
        console.log(response.data);

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false); // Ensure initial loading state is set to false after the first fetch completes
        setIsFiltering(false); // Set filtering state false after fetch completes
      }
    };

    fetchSwapRequests();
  }, [searchTerm, serviceRequiredFilter, serviceCategoryFilter]); // Dependencies for search/filter

  const handlePlaceRequest = async (swapRequestId) => {
    setPlacingRequest(true);
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      if (!token) {
        console.error('No token provided');
        toast("Error",{
          variant: "destructive",
          description: "No token provided. Please log in.",
        })
        return;
      }
  
      const response = await axiosInstance.post(`/api/swap-requests/${swapRequestId}/place-request`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Request placed:', response.data);
      toast("Success",{
        description: "Request placed successfully!",
      })
      // Optionally, update the UI to reflect that the request has been placed
      // For example,
    } catch (error) {
      console.error('Error placing request:', error);
      toast("Error", {
        variant: "destructive",
        description: String(error.response?.data?.message || "Failed to place request."),
      })
      // Handle error, e.g., show an error message to the user
    } finally {
      setPlacingRequest(false);
    }
  };
  
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
          placeholder="Search Skills, Services Offered..."
          className="flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* The search button is no longer strictly necessary as typing updates state and useEffect refetches */}
        {/* <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Search</Button> */}
        <Select onValueChange={setServiceRequiredFilter} value={serviceRequiredFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Service Required" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Service Required</SelectItem>
            {/* You might fetch actual service required options from backend if they are dynamic */}
            <SelectItem value="Web Development">Web Development</SelectItem>
            <SelectItem value="Mobile Development">Mobile Development</SelectItem>
            <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
            <SelectItem value="Graphic Design">Graphic Design</SelectItem>
            <SelectItem value="Writing">Writing</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
         <Select onValueChange={setServiceCategoryFilter} value={serviceCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Any Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Category</SelectItem>
            {categories.map(category => (
               <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
            ))}
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
                  {request.preferredLocation}
                </p>
                <p className="flex items-center mb-1">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                   </svg>
                  {request.yearsOfExperience ? `${request.yearsOfExperience} years of experience` : 'N/A'}
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
                <Button variant="outline" asChild className="flex-grow"><Link to={`/exchange-skills/${request._id}`}>View Details</Link></Button>
                <Button
                  className="flex-grow"
                  onClick={() => handlePlaceRequest(request._id)}
                  disabled={request.hasPlacedRequest || placingRequest}
                >
                  {request.hasPlacedRequest ? (
                    "Request Placed"
                  ) : placingRequest ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Placing...
                    </>
                  ) : (
                    "Place a Request"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};



export default ExchangeSkills;
