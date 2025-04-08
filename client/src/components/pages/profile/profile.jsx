
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  User,
  Mail,
  Phone,
  VenusAndMars,
  MapPin,
  Building2,
  FileText,
  BadgeCheck,
  Briefcase,
  Code2,
  Calendar as CalendarIcon,
  Clock,
  List,
  MessageSquare,
  Edit
} from "lucide-react"
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import pfp from "@/assets/pfp.jpeg"
import { Button } from "../../ui/button"
import EditProfile from "./edit-profile";
// Dummy data - replace with your actual data fetching
const profileData = {
  profilePicture: pfp, // Replace with actual image URL
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 555-123-4567",
  gender: "Male",
  country: "USA",
  city: "New York",
  resume: "resume.pdf",
  qualifications: ["Bachelor's Degree", "Master's Degree"],
  yearsOfExperience: 5,
  experienceLevel: "Senior",
  skills: ["React", "Node.js", "JavaScript"],
  certifications: ["Certified React Developer", "AWS Certified"],
  responseTime: "Within 24 hours",
  availability: "Full-time",
  serviceDescription: "Experienced software engineer specializing in web development."
};

const ProfilePage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Profile and Details Section */}
      <Card className="mb-8 bg-gray-100">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-4 px-8">
            <Avatar className="h-40 w-40 md:h-64 md:w-64">
              <AvatarImage src={profileData.profilePicture} alt={profileData.name} />
              <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-start w-full">
              <div className="flex items-center justify-start gap-3">
                <h1 className="text-2xl font-bold text-primary">{profileData.name}</h1>
                <Dialog>
                  <DialogTrigger asChild>
                    <Edit className="h-6 w-6 text-primary cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here.
                      </DialogDescription>
                    </DialogHeader>
                    <EditProfile/>
                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {/* Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Name</p>
                  </div>
                  <p>{profileData.name}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Email</p>
                  </div>
                  <p>{profileData.email}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Phone</p>
                  </div>
                  <p>{profileData.phone}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <VenusAndMars  className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Gender</p>
                  </div>
                  <p>{profileData.gender}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Country</p>
                  </div>
                  <p>{profileData.country}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">City</p>
                  </div>
                  <p>{profileData.city}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Info Section */}
      <Card className="bg-gray-100">
        <CardHeader>
          <div className="flex items-center justify-start gap-3">
            <CardTitle className="text-primary text-xl">Technical Information</CardTitle>
            <Dialog>
                  <DialogTrigger asChild>
                    <Edit className="h-6 w-6 text-primary cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here.
                      </DialogDescription>
                    </DialogHeader>
                    {/* Add your edit form here */}
                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-1">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Resume</p>
              </div>
              <a href={`/${profileData.resume}`} target="_blank" rel="noopener noreferrer" className="underline text-blue-500">
                {profileData.resume}
              </a>
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Qualifications</p>
              </div>
              <ul className="list-disc list-inside">
                {profileData.qualifications.map((q, index) => (
                  <li key={index}>{q}</li>
                ))}
              </ul>
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Years of Experience</p>
              </div>
              <p>{profileData.yearsOfExperience}</p>
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Experience Level</p>
              </div>
              <p>{profileData.experienceLevel}</p>
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Skills</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <Badge key={index}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Certifications</p>
              </div>
              <ul className="list-disc list-inside">
                {profileData.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Response Time</p>
              </div>
              <p>{profileData.responseTime}</p>
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Availability</p>
              </div>
              <p>{profileData.availability}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Service Description</p>
            </div>
            <p>{profileData.serviceDescription}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
