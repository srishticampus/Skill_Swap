import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

const OrganizationProfile = () => {
  // Placeholder data
  const organizationData = {
    name: 'Skill Gain Org Pvt Ltd.',
    phone: '+91 1234567890',
    address: 'Gain Plaza, Trivandrum , India',
    certificate: 'gaincertificate.pdf',
    email: 'skillgainorg@gmail.com',
    registerNumber: 'reg122356',
    pincode: '695588',
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* Main Content */}
      <main className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold text-center mb-8 text-purple-700 dark:text-purple-400">View Organization Profile</h2>

        {/* Organization Info Card */}
        <Card className="max-w-3xl mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">Organization Info</CardTitle>
            <Pencil className="h-5 w-5 text-gray-600 dark:text-gray-300 cursor-pointer" />
          </CardHeader>
          <CardContent>
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

            {/* Edit Button */}
            <div className="flex justify-center mt-6">
              <Button className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white">Edit</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrganizationProfile;