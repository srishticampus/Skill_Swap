import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import axios from '@/api/axios'; // Assuming axios is configured for API calls
import { Skeleton } from '@/components/ui/skeleton';
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
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router';
import { toast } from "sonner";

const OrganizationProfile = () => {
  const navigate = useNavigate();
  const [organizationData, setOrganizationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchOrganizationProfile = async () => {
      try {
        const response = await axios.get('/api/organizations/profile'); // Assuming the API endpoint
        setOrganizationData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationProfile();
  }, []);

  useEffect(() => {
    if (organizationData) {
      setFormData(organizationData);
    }
  }, [organizationData]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(organizationData); // Reset form data to original
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put('/api/organizations/profile', formData);
      setOrganizationData(response.data);
      setIsEditing(false);
    } catch (error) {
      setError(error);
      console.error('Error updating organization profile:', error);
      // Optionally, display an error message to the user
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <main className="container mx-auto py-8">
          <Skeleton className="h-8 w-1/3 mx-auto mb-8" /> {/* Title skeleton */}
          <Card className="max-w-3xl mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-6 w-1/4" /> {/* Card title skeleton */}
              <Skeleton className="h-8 w-24" /> {/* Edit button skeleton */}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-1/3 mb-2" /> {/* Label skeleton */}
                    <Skeleton className="h-8 w-full" /> {/* Input/Value skeleton */}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100 flex items-center justify-center text-red-500">
        Error loading organization profile: {error.message}
      </div>
    );
  }

  const handleDeleteOrganization = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast("Error", {
          variant: "destructive",
          description: "No token provided. Please log in.",
        });
        return;
      }

      await axios.delete('/api/organizations/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast("Success", {
        description: "Organization deleted successfully!",
      });
      navigate('/'); // Redirect to home or a suitable page after deletion
    } catch (error) {
      console.error('Error deleting organization:', error);
      toast("Error", {
        variant: "destructive",
        description: String(error.response?.data?.message || "Failed to delete organization."),
      });
    } finally {
      setDeleting(false);
    }
  };

  if (!organizationData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        No organization data found.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* Main Content */}
      <main className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold text-center mb-8 text-primary dark:text-purple-400">View Organization Profile</h2>

        {/* Organization Info Card */}
        <Card className="max-w-3xl mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">Organization Info</CardTitle>
            {isEditing ? (
              <div>
                <Button className="mr-2" onClick={handleSaveClick}>Save</Button>
                <Button variant="outline" onClick={handleCancelClick}>Cancel</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Pencil className="h-5 w-5 text-gray-600 dark:text-gray-300 cursor-pointer" onClick={handleEditClick} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={deleting}>
                      {deleting ? "Deleting..." : "Delete Organization"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your organization
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteOrganization} disabled={deleting}>
                        {deleting ? "Deleting..." : "Continue"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-purple-600 dark:text-purple-300">Organization Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 text-black dark:text-white"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-purple-600 dark:text-purple-300">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 text-black dark:text-white"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-purple-600 dark:text-purple-300">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 text-black dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-purple-600 dark:text-purple-300">Certificate</label>
                    <input
                      type="text"
                      name="certificate"
                      value={formData.certificate || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 text-black dark:text-white"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-purple-600 dark:text-purple-300">Email ID</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 text-black dark:text-white"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-purple-600 dark:text-purple-300">Register Number</label>
                    <input
                      type="text"
                      name="registerNumber"
                      value={formData.registerNumber || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 text-black dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-purple-600 dark:text-purple-300">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 text-black dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Organization Name</p>
                    <p className="text-base">{organizationData.name}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Phone Number</p>
                    <p className="text-base">{organizationData.phone}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Address</p>
                    <p className="text-base">{organizationData.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Certificate</p>
                    <a href="#" className="text-base text-blue-600 dark:text-blue-400 hover:underline">{organizationData.certificate}</a>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Email ID</p>
                    <p className="text-base">{organizationData.email}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Register Number</p>
                    <p className="text-base">{organizationData.registerNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Pincode</p>
                    <p className="text-base">{organizationData.pincode}</p>
                  </div>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrganizationProfile;
