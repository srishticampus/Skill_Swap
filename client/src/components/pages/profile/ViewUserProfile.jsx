import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { MapPin, Briefcase, Star, User, Mail, Phone, Globe, Venus } from 'lucide-react';
import axiosInstance from '@/api/axios';
import { Skeleton } from "@/components/ui/skeleton";

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {halfStar && <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 rotate-180 transform scale-x-[-1]" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 fill-gray-300 text-gray-300" />
      ))}
    </div>
  );
};

export default function ViewUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/auth/users/${id}`);
        setUserDetails(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 w-full min-h-screen bg-gray-100">
        <Skeleton className="h-8 w-64 mx-auto my-8" />
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start mb-8 pb-8 border-b border-gray-200">
            <Skeleton className="w-32 h-32 rounded-full mr-0 md:mr-8 mb-6 md:mb-0" />
            <div className="flex flex-col flex-grow w-full">
              <Skeleton className="h-8 w-48 mb-4 mx-auto md:mx-0" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="w-5 h-5 mr-3" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-6 w-48" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 w-full min-h-screen bg-gray-100 text-center text-red-600">Error loading details: {error.message}</div>;
  }

  if (!userDetails) {
    return <div className="p-6 w-full min-h-screen bg-gray-100 text-center">User not found.</div>;
  }

  return (
    <div className="p-6 w-full min-h-screen bg-gray-100">
      <Button onClick={() => navigate(-1)} className="mb-4">Back</Button>
      <h1 className="text-2xl font-semibold text-[#4E20B3] text-center my-8">
        User Profile
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start mb-8 pb-8 border-b border-gray-200">
          <img
            src={`${import.meta.env.VITE_API_URL}${userDetails.profilePictureUrl}`}
            alt={userDetails.name}
            className="w-32 h-32 rounded-full mr-0 md:mr-8 mb-6 md:mb-0 object-cover border-4 border-[#4E20B3]"
          />
          <div className="flex flex-col flex-grow w-full">
            <h2 className="text-3xl font-bold text-[#4E20B3] mb-4 text-center md:text-left">
              {userDetails.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 text-base">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-gray-500" />
                <span>{userDetails.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-gray-500" />
                <span>{userDetails.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gray-500" />
                <span>{userDetails.phone}</span>
              </div>
              <div className="flex items-center">
                <Venus className="w-5 h-5 mr-3 text-gray-500" />
                <span>{userDetails.gender}</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-3 text-gray-500" />
                <span>{userDetails.country}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                <span>{userDetails.city}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-[#4E20B3] mb-6">Technical Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-gray-700 text-base">
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Years of Experience</p>
              <p className="text-gray-800 font-medium">{userDetails.yearsOfExperience}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Skills</p>
              <p className="text-gray-800 font-medium">{userDetails.skills?.join(', ') || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Service Description</p>
              <p className="text-gray-800 font-medium">{userDetails.serviceDescription || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Response Time</p>
              <p className="text-gray-800 font-medium">{userDetails.responseTime || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Availability</p>
              <p className="text-gray-800 font-medium">{userDetails.availability || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
