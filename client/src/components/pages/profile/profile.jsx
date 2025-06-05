import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
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
  Edit,
  Trash2,
  Star
} from "lucide-react"
import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import { Button } from "../../ui/button"
import EditProfile from "./edit-profile";
import EditTechnicalInfo from "./edit-technical";
import axiosInstance from '@/api/axios';
import { toast } from "sonner"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from '@/components/ui/skeleton';


const ProfilePage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]); // New state for reviews
  const [isMentorRequestModalOpen, setIsMentorRequestModalOpen] = useState(false); // Re-added mentor request modal state
  const [mentorRequestText, setMentorRequestText] = useState("");
  const [isAddCertificationModalOpen, setIsAddCertificationModalOpen] = useState(false);
  const [certificationType, setCertificationType] = useState("text");
  const [certificationValue, setCertificationValue] = useState("");
  const [certificationFile, setCertificationFile] = useState(null);
  const [categories, setCategories] = useState([]); // State for all categories


  const fetchProfileData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/auth/profile');

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }, []);

  const fetchReviews = useCallback(async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/user-reviews/${userId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  useEffect(() => {
    if (profileData?._id) {
      fetchReviews(profileData._id);
    }
  }, [profileData, fetchReviews]);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);


  const handleMentorRequestClose = () => {
    setIsMentorRequestModalOpen(false);
    setMentorRequestText("");
  };

  const handleMentorRequestSubmit = async () => {
    try {
      await axiosInstance.post('/api/admin/mentor-requests', {
        requestText: mentorRequestText,
        userId: profileData._id,
      });
      console.log("Mentor Request Submitted:", mentorRequestText);
      toast.success(
        "Request submitted!",
        { description: "Your request to be a mentor has been submitted." },
      )
      handleMentorRequestClose();
      // Optionally show a success message to the user
    } catch (error) {
      console.error("Error submitting mentor request:", error);
      // Optionally show an error message to the user
    }
  };

  const handleDeleteCertification = async (cert) => {
    try {
      await axiosInstance.delete('/api/auth/delete-certification', {
        data: { certification: cert },
      });

      // Update profile data after successful deletion
      const updatedCertifications = profileData.certifications.filter(c => c !== cert);
      setProfileData({ ...profileData, certifications: updatedCertifications });

      toast.success("Certification deleted successfully!");
    } catch (error) {
      console.error("Error deleting certification:", error);
      toast.error("Failed to delete certification.");
    }
  };

  const handleAddCertificationOpen = () => {
    setIsAddCertificationModalOpen(true);
  };

  const handleAddCertificationClose = () => {
    setIsAddCertificationModalOpen(false);
    setCertificationType("text");
    setCertificationValue("");
    setCertificationFile(null);
  };

  const handleAddCertificationSubmit = async () => {
    try {
      const formData = new FormData();
      if (certificationType === "file") {
        formData.append("certificationFile", certificationFile);
      } else if (certificationType === "url") {
        formData.append("certificationURL", certificationValue);
      } else {
        formData.append("certificationText", certificationValue);
      }

      await axiosInstance.post('/api/auth/add-certification', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh profile data
      fetchProfileData();

      toast.success("Certification added successfully!");
      handleAddCertificationClose();
    } catch (error) {
      console.error("Error adding certification:", error);
      toast.error("Failed to add certification.");
    }
  };


  // Resolve category IDs to names
  const userCategories = profileData?.categories?.map(categoryId => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown Category';
  }).filter(Boolean) || [];


  if (!profileData) {
    return (
      <div className="container mx-auto p-4">
        {/* Profile and Details Section Skeleton */}
        <Card className="mb-8 bg-gray-100">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-4 px-8">
              <Skeleton className="h-40 w-40 md:h-64 md:w-64 rounded-full" /> {/* Avatar skeleton */}
              <div className="flex flex-col justify-start w-full">
                <Skeleton className="h-8 w-1/2 mb-4" /> {/* Name skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-1/4 mb-2" /> {/* Label skeleton */}
                      <Skeleton className="h-6 w-3/4" /> {/* Value skeleton */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Info Section Skeleton */}
        <Card className="bg-gray-100">
          <CardHeader>
            <Skeleton className="h-8 w-1/3" /> {/* Technical Info title skeleton */}
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="col-span-1">
                  <Skeleton className="h-4 w-1/3 mb-2" /> {/* Label skeleton */}
                  <Skeleton className="h-6 w-full" /> {/* Value skeleton */}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section Skeleton */}
        <Card className="mt-8 bg-gray-100">
          <CardHeader>
            <Skeleton className="h-8 w-1/4" /> {/* Reviews title skeleton */}
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar skeleton */}
                  <Skeleton className="h-6 w-1/4" /> {/* Rater name skeleton */}
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="h-4 w-4 rounded-full mr-1" />
                    ))}
                  </div>
                </div>
                <Skeleton className="h-10 w-full" /> {/* Review text skeleton */}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Profile and Details Section */}
      <Card className="mb-8 bg-gray-100">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-4 px-8">
            <Avatar className="h-40 w-40 md:h-64 md:w-64">
              <AvatarImage src={profileData.profilePictureUrl ? `${import.meta.env.VITE_API_URL}/${profileData.profilePictureUrl}` : undefined} alt={profileData.name} />
              <AvatarFallback>
                {profileData.profilePictureUrl ? (
                  profileData?.name?.charAt(0) || 'N'
                ) : (
                  <User className="h-1/2 w-1/2" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-start w-full">
              <div className="flex items-center justify-start gap-3">
                <h1 className="text-2xl font-bold text-primary">{profileData.name}</h1>
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
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
                    <EditProfile setIsEditModalOpen={setIsEditModalOpen} onProfileUpdate={fetchProfileData} />

                  </DialogContent>
                </Dialog>

                {/* {profileData.mentor ?
                  <Badge variant="outline" className='text-sm'>Mentor</Badge>
                  :
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Request to be a Mentor</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Request to be a Mentor</DialogTitle>
                        <DialogDescription>
                          Explain your qualifications and experience for becoming a mentor.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="mentor-request">Qualifications</Label>
                          <Textarea
                            id="mentor-request"
                            placeholder="Enter your qualifications and experience here."
                            value={mentorRequestText}
                            onChange={(e) => setMentorRequestText(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleMentorRequestSubmit}>Submit Request</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                } */}
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
                    <VenusAndMars className="h-4 w-4 text-muted-foreground" />
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
                {profileData.organization && ( // Conditionally render organization
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Organization</p>
                    </div>
                    <p>{profileData.organization.name}</p>
                  </div>
                )}
              </div>
              {profileData.organization && ( // Add Complaint button for organization members
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={() => console.log("Add Complaint clicked")}>
                    Add Complaint
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Info Section */}
      <Card className="bg-gray-100">
        <CardHeader>
          <div className="flex items-center justify-start gap-3">
            <CardTitle className="text-primary text-xl">Technical Information</CardTitle>
            <Dialog open={isTechModalOpen} onOpenChange={setIsTechModalOpen}>
              <DialogTrigger asChild>
                <Edit className="h-6 w-6 text-primary cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="max-w-3xl!">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here.
                  </DialogDescription>
                </DialogHeader>
                <EditTechnicalInfo className="" setIsTechModalOpen={setIsTechModalOpen} onProfileUpdate={fetchProfileData} />
                {/* <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter> */}
              </DialogContent>
            </Dialog>
            <Dialog open={isAddCertificationModalOpen} onOpenChange={setIsAddCertificationModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={handleAddCertificationOpen}>Add Certification</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Certification</DialogTitle>
                  <DialogDescription>
                    Choose the type and enter the details of the certification.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="certification-type">Type</Label>
                    <Select value={certificationType} onValueChange={setCertificationType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                        <SelectItem value="file">File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {certificationType === "text" && (
                    <div className="grid gap-2">
                      <Label htmlFor="certification-text">Text</Label>
                      <Input
                        type="text"
                        id="certification-text"
                        value={certificationValue}
                        onChange={(e) => setCertificationValue(e.target.value)}
                      />
                    </div>
                  )}
                  {certificationType === "url" && (
                    <div className="grid gap-2">
                      <Label htmlFor="certification-url">URL</Label>
                      <Input
                        type="url"
                        id="certification-url"
                        value={certificationValue}
                        onChange={(e) => setCertificationValue(e.target.value)}
                      />
                    </div>
                  )}
                  {certificationType === "file" && (
                    <div className="grid gap-2">
                      <Label htmlFor="certification-file">File</Label>
                      <Input
                        type="file"
                        id="certification-file"
                        onChange={(e) => setCertificationFile(e.target.files[0])}
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleAddCertificationSubmit}>
                    Add Certification
                  </Button>
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
              <a href={`${import.meta.env.VITE_API_URL}/${profileData.resume}`} target="_blank" rel="noopener noreferrer" className="underline text-blue-500">
                {profileData.resume}
              </a>
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Qualifications</p>
              </div>
              <ul className="list-disc list-inside">
                {profileData.qualifications?.map((q, index) => (
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
                {profileData.skills?.map((skill, index) => (
                  <Badge key={index}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {userCategories.map((categoryName, index) => (
                  <Badge key={index}>
                    {categoryName}
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
                {profileData.certifications?.map((cert, index) => (
                  <li key={index} className="flex items-center justify-between">
                    {cert.startsWith("uploads/") ? (
                      <a
                        href={`${import.meta.env.VITE_API_URL}/${cert}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary"
                      >
                        {cert.split("/")[1].split("-")[1]}
                      </a>
                    ) : (
                      <span>{cert}</span>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCertification(cert)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
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

      {/* Reviews Section */}
      <Card className="mt-8 bg-gray-100">
        <CardHeader>
          <CardTitle className="text-primary text-xl">Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={review.rater.profilePictureUrl ? `${import.meta.env.VITE_API_URL}/${review.rater.profilePictureUrl}` : undefined} alt={review.rater.name} />
                    <AvatarFallback>
                      {review.rater.profilePictureUrl ? (
                        review.rater?.name?.charAt(0) || 'N'
                      ) : (
                        <User className="h-1/2 w-1/2" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{review.rater.name}</p>
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-gray-300" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.reviewText}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
