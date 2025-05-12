import React from 'react';
import { Link } from 'react-router'; // Import Link
import { MapPin, Briefcase, Star, ArrowRight } from 'lucide-react'; // Assuming icons like these

const placeholderSwappers = [
  {
    id: 1,
    name: 'Akshay',
    title: 'Python, Java',
    location: '123 city, trivandrum',
    experience: '3+ years Experience',
    rating: 4, // Out of 5
    deadline: 'Before 21 April 2025',
    imageUrl: 'https://picsum.photos/200/300',
    skills: ['SDLC'],
  },
  {
    id: 2,
    name: 'Abhila',
    title: 'Python, Java',
    location: '123 city, trivandrum',
    experience: '3+ years Experience',
    rating: 3.5,
    deadline: 'Before 21 April 2025',
    imageUrl: 'https://picsum.photos/200/300',
    skills: ['SDLC'],
  },
  {
    id: 3,
    name: 'Angel',
    title: 'Python, Java',
    location: '123 city, trivandrum',
    experience: '3+ years Experience',
    rating: 4.5,
    deadline: 'Before 21 April 2025',
    imageUrl: 'https://picsum.photos/200/300',
    skills: ['SDLC'],
  },
  {
    id: 4,
    name: 'Deva',
    title: 'Python, Java',
    location: '123 city, trivandrum',
    experience: '3+ years Experience',
    rating: 4,
    deadline: 'Before 21 April 2025',
    imageUrl: 'https://picsum.photos/200/300',
    skills: ['SDLC'],
  },
  {
    id: 5,
    name: 'Deva',
    title: 'Python, Java',
    location: '123 city, trivandrum',
    experience: '3+ years Experience',
    rating: 4,
    deadline: 'Before 21 April 2025',
    imageUrl: 'https://picsum.photos/200/300',
    skills: ['SDLC'],
  },
  // Add more placeholder data if needed
];

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
  return (
    <div className="p-6 pt-0 w-full"> {/* Adjust padding as needed */}
      <h1 className="text-xl font-semibold text-[#4E20B3] text-center my-8">
        View All Skill Swappers
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {placeholderSwappers.map((swapper) => (
          <div key={swapper.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <div className="flex items-center mb-4">
              <img
                src={swapper.imageUrl}
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
