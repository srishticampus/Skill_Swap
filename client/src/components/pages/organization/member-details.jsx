import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router'; // Import useParams and useNavigate
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Pencil, User, Mail, Phone, MapPin, Globe, FileText, GraduationCap, Code, Briefcase, Award, Star } from 'lucide-react';
import axios from '@/api/axios'; // Import axios
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

const MemberDetails = () => {
  const { id } = useParams(); // Get member ID from URL
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/organizations/members/${id}`);
        setMember(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching member details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetails();
  }, [id]); // Refetch when ID changes

  if (loading) {
    return (
      <div className="container mx-auto p-6 min-h-screen">
        {/* Title Skeleton */}
        <Skeleton className="h-8 w-1/3 mx-auto mb-8" />

        {/* Personal Info Card Skeleton */}
        <Card className="bg-white border-gray-200 rounded-lg overflow-hidden mb-8">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-1/4 mb-4" /> {/* Title skeleton */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Skeleton className="w-32 h-32 rounded-full" /> {/* Avatar skeleton */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Skeleton className="col-span-full h-8 w-1/2 mb-2" /> {/* Name skeleton */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" /> {/* Icon skeleton */}
                    <Skeleton className="h-5 w-3/4" /> {/* Text skeleton */}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Info Card Skeleton */}
        <Card className="bg-white border-gray-200 rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-1/4 mb-4" /> {/* Title skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="mb-4">
                  <Skeleton className="h-4 w-1/3 mb-1" /> {/* Label skeleton */}
                  <Skeleton className="h-6 w-full" /> {/* Value skeleton */}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-6 text-white min-h-screen">Error: {error.message}</div>;
  }

  if (!member) {
    return <div className="container mx-auto p-6 text-white min-h-screen">Member not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 text-white min-h-screen">
      <Button onClick={() => navigate(-1)} className="mb-4">Back</Button>
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">View More</h1>

      {/* Personal Info Card */}
      <Card className="bg-white border-gray-200 rounded-lg overflow-hidden mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">Personal Info</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <Avatar className="w-32 h-32">
              <AvatarImage src={member.profilePicture ? `${import.meta.env.VITE_API_URL}/${member.profilePicture}` : '/src/assets/profile-pic.png'} alt={member.name} /> {/* Use profilePicture from API */}
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>

            {/* Details */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Name and Edit */}
              <div className="col-span-full flex items-center mb-2">
                <h3 className="text-2xl font-semibold text-gray-800 mr-2">{member.name}</h3>
                {/* Edit functionality can be added here */}
                {/* <Pencil size={20} className="text-primary cursor-pointer" /> */}
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
                <span>{member.city}</span> {/* Use city from API */}
              </div>
              <div className="flex items-center text-gray-700">
                <Globe size={18} className="mr-2 text-primary" />
                <span>{member.country}</span> {/* Use country from API */}
              </div>
              {member.completedSwapsCount !== undefined && (
                <div className="flex items-center text-gray-700">
                  <Award size={18} className="mr-2 text-primary" />
                  <span>Completed Swaps: {member.completedSwapsCount}</span>
                </div>
              )}
              {member.positiveReviewsCount !== undefined && (
                <div className="flex items-center text-gray-700">
                  <Star size={18} className="mr-2 text-primary" />
                  <span>Positive Reviews: {member.positiveReviewsCount}</span>
                </div>
              )}
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
                {member.resume ? ( // Check if resume exists
                  <a href={member.resume} className="text-blue-600 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                    <FileText size={16} className="mr-1" />
                    View Resume
                  </a>
                ) : (
                  <p className="text-gray-700">No resume provided</p>
                )}
              </div>
              <div className="mb-4">
                <p className="text-sm text-primary mb-1">Qualification</p>
                <p className="text-gray-700">{member.qualifications ? member.qualifications.join(', ') : 'N/A'}</p> {/* Use qualifications from API */}
              </div>
              <div>
                <p className="text-sm text-primary mb-1">Skills</p>
                <p className="text-gray-700">{member.skills ? member.skills.join(', ') : 'N/A'}</p> {/* Use skills from API */}
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-4">
                <p className="text-sm text-primary mb-1">Years of Experience</p>
                <p className="text-gray-700">{member.yearsOfExperience || 'N/A'}</p> {/* Use yearsOfExperience from API */}
              </div>
              <div className="mb-4">
                <p className="text-sm text-primary mb-1">Experience Level</p>
                <p className="text-gray-700">{member.experienceLevel || 'N/A'}</p> {/* Use experienceLevel from API */}
              </div>
              <div>
                <p className="text-sm text-primary mb-1">Certifications</p>
                <p className="text-gray-700">{member.certifications ? member.certifications.join(', ') : 'N/A'}</p> {/* Use certifications from API */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDetails;
