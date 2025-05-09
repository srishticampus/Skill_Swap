import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button'; // Assuming edit functionality might use a button or icon button
import { Pencil, User, Mail, Phone, MapPin, Globe, FileText, GraduationCap, Code, Briefcase, Award } from 'lucide-react'; // Icons based on the image

const MemberDetails = () => {
  // Dummy data for a single member (replace with actual data fetching logic)
  const member = {
    id: 1,
    name: 'David D',
    gender: 'male',
    email: 'davidd@gmail.com',
    location: 'Trivandrum', // Based on image, just city name
    country: 'India', // Based on image
    phone: '+91 1234567890',
    avatarUrl: '/src/assets/profile-pic.png', // Replace with actual image path
    resumeUrl: '#', // Dummy resume link
    qualification: "Bachelor's Degree in Visual Communication",
    skills: "Web Development, Graphic Design",
    yearsOfExperience: "3 Years",
    experienceLevel: "Intermediate",
    certifications: "Adobe Certified Professional in Photoshop & Illustrator",
  };

  return (
    <div className="container mx-auto p-6 text-white min-h-screen">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">View More</h1>

      {/* Personal Info Card */}
      <Card className="bg-white border-gray-200 rounded-lg overflow-hidden mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">Personal Info</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <Avatar className="w-32 h-32">
              <AvatarImage src={member.avatarUrl} alt={member.name} />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>

            {/* Details */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Name and Edit */}
              <div className="col-span-full flex items-center mb-2">
                <h3 className="text-2xl font-semibold text-gray-800 mr-2">{member.name}</h3>
                <Pencil size={20} className="text-primary cursor-pointer" />
              </div>

              {/* Contact Info */}
              <div className="flex items-center text-gray-700">
                <User size={18} className="mr-2 text-primary" />
                <span>{member.name}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Mail size={18} className="mr-2 text-primary" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Phone size={18} className="mr-2 text-primary" />
                <span>{member.phone}</span>
              </div>

              {/* Location Info */}
              <div className="flex items-center text-gray-700">
                <MapPin size={18} className="mr-2 text-primary" />
                <span>{member.location}</span>
              </div>
               <div className="flex items-center text-gray-700">
                <Globe size={18} className="mr-2 text-primary" />
                <span>{member.country}</span>
              </div>
               <div className="flex items-center text-gray-700">
                <Briefcase size={18} className="mr-2 text-primary" /> {/* Using Briefcase for Trivandrum as per image hint */}
                <span>Trivandrum</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Info Card */}
      <Card className="bg-white border-gray-200 rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">Technical Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <p className="text-sm text-primary mb-1">Resume</p>
                <a href={member.resumeUrl} className="text-blue-600 hover:underline flex items-center">
                  <FileText size={16} className="mr-1" />
                  David D Resume.pdf
                </a>
              </div>
              <div className="mb-4">
                <p className="text-sm text-primary mb-1">Qualification</p>
                <p className="text-gray-700">{member.qualification}</p>
              </div>
              <div>
                <p className="text-sm text-primary mb-1">Skills</p>
                <p className="text-gray-700">{member.skills}</p>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-4">
                <p className="text-sm text-primary mb-1">Years of Experience</p>
                <p className="text-gray-700">{member.yearsOfExperience}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-primary mb-1">Experience Level</p>
                <p className="text-gray-700">{member.experienceLevel}</p>
              </div>
              <div>
                <p className="text-sm text-primary mb-1">Certifications</p>
                <p className="text-gray-700">{member.certifications}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDetails;