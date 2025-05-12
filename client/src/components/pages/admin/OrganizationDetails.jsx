import React from 'react';
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button"; // Assuming a button component exists

function OrganizationDetails() {
  const { id } = useParams(); // Get the organization ID from the URL
  // Placeholder data - This would ideally come from API calls based on the selected organization
  const organization = {
    name: "Skill Gain Org Pvt Ltd.",
    phone: "+91 1234567890",
    address: "Gain Plaza, Trivandrum , India",
    certificate: "gaincertificate.pdf",
    email: "skillgainorg@gmail.com",
    registerNumber: "reg122356",
    pincode: "695588",
  };

  // Placeholder functions for button actions
  const handleActivate = () => {
    console.log("Activate button clicked");
    // Implement activation logic here
  };

  const handleDeactivate = () => {
    console.log("Deactivate button clicked");
    // Implement deactivation logic here
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-700">Activate / Deactivate</h2>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-lg max-w-2xl mx-auto" style={{ minHeight: '400px' }}> {/* Added minHeight for visual spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {/* Left Column */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Organization Name</p>
            <p className="text-base font-medium mb-4">{organization.name}</p>

            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
            <p className="text-base font-medium mb-4">{organization.phone}</p>

            <p className="text-sm text-gray-500 mb-1">Address</p>
            <p className="text-base font-medium mb-4">{organization.address}</p>

            <p className="text-sm text-gray-500 mb-1">Certificate</p>
            <Button
              variant="link"
              className="p-0 text-blue-600 hover:underline text-base font-medium"
              asChild
              onClick={() => {
                console.log("Certificate button clicked");
                // TODO: Implement navigation to the certificate page for this organization
              }}
            >
              <a href="#" >{organization.certificate}</a>
            </Button>
          </div>

          {/* Right Column */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Email ID</p>
            <p className="text-base font-medium mb-4">{organization.email}</p>

            <p className="text-sm text-gray-500 mb-1">Register Number</p>
            <p className="text-base font-medium mb-4">{organization.registerNumber}</p>

            <p className="text-sm text-gray-500 mb-1">Pincode</p>
            <p className="text-base font-medium mb-4">{organization.pincode}</p>
            {/* View Review Button */}
            <p className="text-sm text-gray-500 mb-1">Pincode</p>

            {/* View Review Button */}
            <Link to={`/admin/organizations/details/${id}/reviews`}>
              <Button
                variant="link"
                className="p-0 text-blue-600 hover:underline text-base font-medium"
              >
                View Reviews
              </Button>
            </Link>
          </div>
        </div>

        {/* Activate/Deactivate Buttons */}
        <div className="flex justify-center gap-4 mt-8">

          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 text-purple-700 border-purple-700 hover:bg-purple-50"
            onClick={handleActivate}
          >
            Activate
          </Button>
          <Button
            variant="default"
            size="lg"
            className="px-8 py-3 bg-purple-700 hover:bg-purple-800 text-white"
            onClick={handleDeactivate}
          >
            Deactivate
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrganizationDetails;
