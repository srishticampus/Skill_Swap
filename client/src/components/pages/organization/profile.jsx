import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import axios from '@/api/axios'; // Assuming axios is configured for API calls

const OrganizationProfile = () => {
  const [organizationData, setOrganizationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        Loading organization profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center text-red-500">
        Error loading organization profile: {error.message}
      </div>
    );
  }

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
        <h2 className="text-2xl font-semibold text-center mb-8 text-purple-700 dark:text-purple-400">View Organization Profile</h2>

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
              <Pencil className="h-5 w-5 text-gray-600 dark:text-gray-300 cursor-pointer" onClick={handleEditClick} />
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