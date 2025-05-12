import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SwapRequestDetails = () => {
  // Placeholder data based on the provided image
  const swapRequestData = {
    user: {
      name: 'Abilash A',
      profilePicture: '/src/assets/profile-pic.png', // Placeholder image
      email: 'abilash@gmail.com',
      phone: '+91 1234567890',
      gender: 'Male',
      location: 'India',
      city: 'Trivandrum',
      yearsOfExperience: 3,
    },
    technicalInfo: {
      resume: 'Abilash A Resume.pdf',
      category: ['Python', 'Java'], // Assuming category can be multiple
      skills: ['SDLC'], // Assuming skills can be multiple
      senderName: 'Ashika', // This seems odd in a request details view, keeping as per image
      serviceDescription: 'I ensure that software application functions correctly and meet specified requirements. They design and execute test case, identify bugs, and collaborate with developers to resolve issue.',
      serviceOffered: 'Testing',
      serviceRequired: 'Web Designing',
      deadline: 'Before 21 April 2025',
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Top Section: User Basic Info */}
      <Card className="mb-8 rounded-lg shadow-md">
        <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start justify-between">
          <div className="flex items-center mb-6 md:mb-0">
            <img
              src={swapRequestData.user.profilePicture}
              alt={swapRequestData.user.name}
              className="w-24 h-24 rounded-full object-cover mr-6"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary mb-4">{swapRequestData.user.name}</h1> {/* Use primary text like in the image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-gray-700">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {swapRequestData.user.name}
                </div>
                <div className="flex items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zM9 9a1 1 0 100 2 1 1 0 000-2zm2-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                  </svg> {/* Placeholder gender icon */}
                  {swapRequestData.user.gender}
                </div>
                 <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {swapRequestData.user.email}
                </div>
                 <div className="flex items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 8a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                   </svg> {/* Placeholder globe icon */}
                   {swapRequestData.user.location}
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM7 4h6v12H7V4z" clipRule="evenodd" />
                  </svg>
                  {swapRequestData.user.phone}
                </div>
                 <div className="flex items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M5 3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V4a1 1 0 00-1-1H5zM4 4h10v10H4V4z" clipRule="evenodd" />
                   </svg> {/* Placeholder building icon */}
                   {swapRequestData.user.city}
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
              <a href="#" className="text-blue-600 hover:underline">{swapRequestData.technicalInfo.resume}</a> {/* Link placeholder */}
            </div>
            <div>
              <p className="text-gray-500 mb-1">Years of Experience</p>
              <p>{swapRequestData.user.yearsOfExperience} Years</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Category</p>
              <div className="flex flex-wrap gap-2">
                {swapRequestData.technicalInfo.category.map((cat, index) => (
                   <Badge key={index} variant="outline" className="text-primary border-primary">{cat}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Service Offered</p>
              <Badge variant="outline" className="text-primary border-primary">{swapRequestData.technicalInfo.serviceOffered}</Badge>
            </div>
             <div>
              <p className="text-gray-500 mb-1">Skills</p>
               <div className="flex flex-wrap gap-2">
                 {swapRequestData.technicalInfo.skills.map((skill, index) => (
                   <Badge key={index} variant="outline" className="text-primary border-primary">{skill}</Badge>
                 ))}
              </div>
            </div>
             <div>
              <p className="text-gray-500 mb-1">Service Required</p>
               <Badge variant="outline" className="text-primary border-primary">{swapRequestData.technicalInfo.serviceRequired}</Badge>
            </div>
             <div>
              <p className="text-gray-500 mb-1">Senders Name</p>
               <p>{swapRequestData.technicalInfo.senderName}</p>
            </div>
             <div>
              <p className="text-gray-500 mb-1">Deadline</p>
              <p>{swapRequestData.technicalInfo.deadline}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-500 mb-1">Service Description</p>
              <p>{swapRequestData.technicalInfo.serviceDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SwapRequestDetails;
