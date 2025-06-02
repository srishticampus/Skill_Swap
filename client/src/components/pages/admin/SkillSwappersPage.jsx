import { useState, useEffect } from 'react';
import { Link } from 'react-router'; // Import Link
import { MapPin, Briefcase, Star, ArrowRight } from 'lucide-react'; // Assuming icons like these
import axiosInstance from '@/api/axios';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {halfStar && <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 rotate-180 transform scale-x-[-1]" />} {/* This half star needs adjustment or a dedicated icon */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 fill-gray-300 text-gray-300" />
      ))}
    </div>
  );
};


export default function SkillSwappersPage() {
  const [swappers, setSwappers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSwappers = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/skill-swappers'); // Make API call using axiosInstance
        const data = response.data; // Access data from response.data
        setSwappers(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSwappers();
  }, []); // Empty dependency array means this effect runs once after the initial render

  if (loading) {
    return (
      <div className="p-6 pt-0 w-full">
        <Skeleton className="h-8 w-1/2 mx-auto mb-8" /> {/* Title skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => ( // Show 8 skeleton cards
            <div key={i} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
              <div className="flex items-center mb-4">
                <Skeleton className="w-20 h-20 rounded-full mr-4" /> {/* Avatar skeleton */}
                <div className="flex flex-col">
                  <Skeleton className="h-6 w-32 mb-2" /> {/* Name skeleton */}
                  <Skeleton className="h-4 w-24" /> {/* Title/Role skeleton */}
                </div>
              </div>
              <div className="text-gray-600 text-sm mb-4 space-y-1">
                <Skeleton className="h-4 w-48" /> {/* Location skeleton */}
                <Skeleton className="h-4 w-40" /> {/* Experience skeleton */}
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="w-4 h-4 rounded-full mr-1" />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center text-sm mb-4">
                <div>
                  <Skeleton className="h-4 w-20 mb-1" /> {/* Skills title */}
                  <Skeleton className="h-6 w-32" /> {/* Skills content */}
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-1" /> {/* Deadline title */}
                  <Skeleton className="h-6 w-24" /> {/* Deadline content */}
                </div>
              </div>
              <Skeleton className="h-10 w-full mt-auto" /> {/* View More button */}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 pt-0 w-full text-center text-red-600">Error loading skill swappers: {error.message}</div>;
  }

  return (
    <div className="p-6 pt-0 w-full"> {/* Adjust padding as needed */}
      <h1 className="text-xl font-semibold text-[#4E20B3] text-center my-8">
        View All Skill Swappers
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {swappers.map((swapper) => (
          <div key={swapper.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <div className="flex items-center mb-4">
              <img
                src={`${import.meta.env.VITE_API_URL}/${swapper.imageUrl}`}
                alt={swapper.name}
                className="w-20 h-20 rounded-full mr-4 object-cover"
              />
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800">{swapper.name}</h2>
                <p className="text-sm text-gray-600">{swapper.title}</p>
              </div>
            </div>

            <div className="text-gray-600 text-sm mb-4 space-y-1">
                <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{swapper.location}</span>
                </div>
                <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{swapper.experience}</span>
                </div>
                <div className="flex items-center">
                     {renderStars(swapper.rating)} {/* Render stars based on rating */}
                </div>
            </div>

            <div className="flex justify-between items-center text-sm mb-4">
                <div>
                    <p className="text-gray-500 font-semibold">Skills</p>
                    <p className="text-gray-800">{swapper.skills.join(', ')}</p>
                </div>
                <div>
                     <p className="text-gray-500 font-semibold text-right">Deadline</p>
                    <p className="text-gray-800 text-right">{swapper.deadline}</p>
                </div>
            </div>

            <Link
              to={`/admin/skill-swappers/${swapper.id}`} // Dynamic link using swapper.id
              className="mt-auto flex items-center justify-center text-[#4E20B3] hover:underline"
            >
              View More <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
