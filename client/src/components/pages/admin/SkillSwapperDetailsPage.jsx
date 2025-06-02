import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useParams, useNavigate } from 'react-router';
import { MapPin, Briefcase, Star, ArrowRight, User, Mail, Phone, Globe, Venus } from 'lucide-react';
import axiosInstance from '@/api/axios'; // Import axiosInstance
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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

export default function SkillSwapperDetailsPage() {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [swapperDetails, setSwapperDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/admin/skill-swappers/${id}`);
      toast("Success!",{
        description: 'Skill swapper deleted successfully.',
        variant: 'success',
      });
      navigate('/admin/skill-swappers');
    } catch (error) {
      toast("Error",{
        description: error.response?.data?.message || 'Failed to delete skill swapper.',
        variant: 'destructive',
      });
      console.error('Error deleting skill swapper:', error);
    }
  };

  useEffect(() => {
    const fetchSwapperDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/admin/skill-swappers/${id}`); // Fetch data using axios and ID
        setSwapperDetails(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSwapperDetails();
  }, [id]); // Rerun effect if ID changes

  if (loading) {
    return (
      <div className="p-6 w-full min-h-screen bg-gray-100">
        <Skeleton className="h-8 w-64 mx-auto my-8" /> {/* Title skeleton */}

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          {/* Top section: Image, Name, Personal Details Skeletons */}
          <div className="flex flex-col md:flex-row items-center md:items-start mb-8 pb-8 border-b border-gray-200">
            <Skeleton className="w-32 h-32 rounded-full mr-0 md:mr-8 mb-6 md:mb-0" /> {/* Image skeleton */}
            <div className="flex flex-col flex-grow w-full">
              <Skeleton className="h-8 w-48 mb-4 mx-auto md:mx-0" /> {/* Name skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {[...Array(6)].map((_, i) => ( // Skeletons for personal details
                  <div key={i} className="flex items-center">
                    <Skeleton className="w-5 h-5 mr-3" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom section: Technical Info Skeletons */}
          <div>
            <Skeleton className="h-6 w-48 mb-6" /> {/* Technical Info title skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {[...Array(8)].map((_, i) => ( // Skeletons for technical details
                <div key={i}>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-6 w-48" />
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Skeleton className="h-10 w-40" /> {/* Delete button skeleton */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 w-full min-h-screen bg-gray-100 text-center text-red-600">Error loading details: {error.message}</div>;
  }

  if (!swapperDetails) {
    return <div className="p-6 w-full min-h-screen bg-gray-100 text-center">Skill swapper not found.</div>;
  }


  return (
    <div className="p-6 w-full min-h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold text-[#4E20B3] text-center my-8">
        Skill Swapper Details
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">

        {/* Top section: Image, Name, Personal Details */}
        <div className="flex flex-col md:flex-row items-center md:items-start mb-8 pb-8 border-b border-gray-200">
          <img
            src={`${import.meta.env.VITE_API_URL}/${swapperDetails.imageUrl}`}
            alt={swapperDetails.name}
            className="w-32 h-32 rounded-full mr-0 md:mr-8 mb-6 md:mb-0 object-cover border-4 border-[#4E20B3]"
          />
          <div className="flex flex-col flex-grow w-full">
            <h2 className="text-3xl font-bold text-[#4E20B3] mb-4 text-center md:text-left">
              {swapperDetails.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 text-base">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-gray-500" />
                <span>{swapperDetails.fullName}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-gray-500" />
                <span>{swapperDetails.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gray-500" />
                <span>{swapperDetails.phone}</span>
              </div>
              <div className="flex items-center">
                <Venus className="w-5 h-5 mr-3 text-gray-500" />
                <span>{swapperDetails.gender}</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-3 text-gray-500" />
                <span>{swapperDetails.country}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                <span>{swapperDetails.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section: Technical Info */}
        <div>
          <h3 className="text-xl font-semibold text-[#4E20B3] mb-6">Technical Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-gray-700 text-base">
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Category</p>
              <p className="text-gray-800 font-medium">{swapperDetails.category}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Years of Experience</p>
              <p className="text-gray-800 font-medium">{swapperDetails.yearsOfExperience}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Skills</p>
              <p className="text-gray-800 font-medium">{swapperDetails.skills.join(', ')}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Service Offered</p>
              <p className="text-gray-800 font-medium">{swapperDetails.serviceOffered}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Senders Name</p>
              <p className="text-gray-800 font-medium">{swapperDetails.senderName}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Service Required</p>
              <p className="text-gray-800 font-medium">{swapperDetails.serviceRequired}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-gray-500 font-semibold text-sm mb-1">Service Description</p>
              <p className="text-gray-800 font-medium">{swapperDetails.serviceDescription}</p>
            </div>
             <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Deadline</p>
              <p className="text-gray-800 font-medium">{swapperDetails.deadline}</p>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Skill Swapper</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the skill swapper account and remove their data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
