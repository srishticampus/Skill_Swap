import React from 'react';
import { MapPin, Briefcase, Star, ArrowRight, User, Mail, Phone, Globe, Venus } from 'lucide-react'; // Assuming lucide-react for icons

// Placeholder data based on the provided image
const swapperDetails = {
  id: 1,
  name: 'Akshay',
  fullName: 'Akshay', // Assuming 'Akshay' next to the User icon is the full name
  email: 'Akshay@gmail.com',
  phone: '+91 1234567890',
  gender: 'Male',
  country: 'India',
  location: 'Trivandrum', // Specific location from details card
  imageUrl: 'https://picsum.photos/200/300', // Use a placeholder image
  category: 'Python, Java',
  skills: ['SDLC'],
  senderName: 'David D',
  serviceDescription: 'I ensure that software application functions correctly and meet specified requirements. They design and execute test case, identify bugs, and collaborate with developers to resolve issue.',
  yearsOfExperience: '3 Years',
  serviceOffered: 'Testing',
  serviceRequired: 'Web Designing',
  deadline: 'Before 21 April 2025',
};

export default function SkillSwapperDetailsPage() {
  // In a real application, you would fetch the swapper details based on an ID
  // from the URL parameters, e.g., using react-router-dom's useParams hook.
  // For now, we use hardcoded placeholder data.

  return (
    <div className="p-6 w-full min-h-screen bg-gray-100"> {/* Added a light background */}
      <h1 className="text-2xl font-semibold text-[#4E20B3] text-center my-8">
        Skill Swapper Details {/* Adjusted heading based on context */}
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto"> {/* Main White Card */}

        {/* Top section: Image, Name, Personal Details */}
        <div className="flex flex-col md:flex-row items-center md:items-start mb-8 pb-8 border-b border-gray-200">
          <img
            src={swapperDetails.imageUrl}
            alt={swapperDetails.name}
            className="w-32 h-32 rounded-full mr-0 md:mr-8 mb-6 md:mb-0 object-cover border-4 border-[#4E20B3]" // Added border
          />
          <div className="flex flex-col flex-grow w-full">
            <h2 className="text-3xl font-bold text-[#4E20B3] mb-4 text-center md:text-left">
              {swapperDetails.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 text-base"> {/* Adjusted grid and text size */}
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-gray-500" /> {/* Increased margin */}
                <span>{swapperDetails.fullName}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-gray-500" /> {/* Increased margin */}
                <span>{swapperDetails.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gray-500" /> {/* Increased margin */}
                <span>{swapperDetails.phone}</span>
              </div>
              <div className="flex items-center">
                <Venus className="w-5 h-5 mr-3 text-gray-500" /> {/* Assuming Venus for gender */}
                <span>{swapperDetails.gender}</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-3 text-gray-500" /> {/* Assuming Globe for country */}
                <span>{swapperDetails.country}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-gray-500" /> {/* Assuming MapPin for location */}
                <span>{swapperDetails.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section: Technical Info */}
        <div>
          <h3 className="text-xl font-semibold text-[#4E20B3] mb-6">Technical Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-gray-700 text-base"> {/* Adjusted grid and gap */}
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Category</p>
              <p className="text-gray-800 font-medium">{swapperDetails.category}</p> {/* Added font-medium */}
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Years of Experience</p>
              <p className="text-gray-800 font-medium">{swapperDetails.yearsOfExperience}</p> {/* Added font-medium */}
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Skills</p>
              <p className="text-gray-800 font-medium">{swapperDetails.skills.join(', ')}</p> {/* Added font-medium */}
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Service Offered</p>
              <p className="text-gray-800 font-medium">{swapperDetails.serviceOffered}</p> {/* Added font-medium */}
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Senders Name</p>
              <p className="text-gray-800 font-medium">{swapperDetails.senderName}</p> {/* Added font-medium */}
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Service Required</p>
              <p className="text-gray-800 font-medium">{swapperDetails.serviceRequired}</p> {/* Added font-medium */}
            </div>
            <div className="sm:col-span-2"> {/* Service Description spans two columns */}
              <p className="text-gray-500 font-semibold text-sm mb-1">Service Description</p>
              <p className="text-gray-800 font-medium">{swapperDetails.serviceDescription}</p> {/* Added font-medium */}
            </div>
             <div>
              <p className="text-gray-500 font-semibold text-sm mb-1">Deadline</p>
              <p className="text-gray-800 font-medium">{swapperDetails.deadline}</p> {/* Added font-medium */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
