import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button"; // Assuming a button component exists
import axiosInstance from '@/api/axios'; // Import axiosInstance

function OrganizationDetails() {
  const { id } = useParams(); // Get the organization ID from the URL
  const [organization, setOrganization] = useState(null); // State for organization data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error status

  // Fetch organization data when the component mounts or id changes
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const res = await axiosInstance.get(`api/admin/organizations/${id}`);
        setOrganization(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching organization details:", err);
        setError("Failed to load organization details.");
        setLoading(false);
      }
    };

    if (id) {
      fetchOrganization();
    }
  }, [id]); // Dependency array includes id

  // Handle activation
  const handleActivate = async () => {
    try {
      const res = await axiosInstance.put(`api/admin/organizations/activate/${id}`);
      console.log("Activate response:", res.data);
      // Update the local state to reflect the status change if needed
      if (organization) {
        setOrganization({...organization, active: true});
      }
      // Optionally show a success message to the user
    } catch (err) {
      console.error("Error activating organization:", err);
      // Optionally show an error message to the user
    }
  };

  // Handle deactivation
  const handleDeactivate = async () => {
    try {
      const res = await axiosInstance.put(`api/admin/organizations/deactivate/${id}`);
      console.log("Deactivate response:", res.data);
      // Update the local state to reflect the status change if needed
      if (organization) {
        setOrganization({...organization, active: false});
      }
      // Optionally show a success message to the user
    } catch (err) {
      console.error("Error deactivating organization:", err);
      // Optionally show an error message to the user
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!organization) {
      return <div className="p-6 text-center">Organization not found.</div>;
  }


  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary">Organization Details</h2> {/* Changed title */}
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
            {/* Active */}
            <p className="text-sm text-gray-500 mb-1">Active</p>
            <p className={`text-base font-medium mb-4 ${organization.active ? 'text-green-600' :'text-red-600'}`}>
                {organization.active ? "Active" : 'Not Active'}
            </p>
            <p className="text-sm text-gray-500 mb-1">Certificate</p>
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 hover:underline text-base font-medium"
              asChild
              onClick={() => {
                console.log("Certificate button clicked for:", organization.certificate);
                // TODO: Implement navigation to the certificate page or open the certificate
                // You might want to use a proper link or modal here
                // window.open(`/api/admin/organizations/${id}/certificate`, '_blank'); // Example if serving certificate via API
              }}
            >
              {/* Display certificate name or a placeholder */}
              {organization.certificate ? <a>{organization.certificate}</a> : <span>No Certificate</span>}
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

            {/* Status */}
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <p className={`text-base font-medium mb-4 ${organization.status === 'active' ? 'text-green-600' : organization.status === 'inactive' ? 'text-red-600' : 'text-yellow-600'}`}>
                {organization.status ? organization.status.toUpperCase() : 'N/A'}
            </p>


            {/* View Review Button */}
            <p className="text-sm text-gray-500 mb-1">Reviews</p> {/* Corrected label */}
            {/* View Review Button */}
            <Link to={`/admin/organizations/details/${id}/reviews`}>
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600 hover:underline text-base font-medium"
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
            className="px-8 py-3 text-green-700 border-green-700 hover:bg-green-50"
            onClick={handleActivate}
            disabled={organization.active === true} // Disable if already active
          >
            Activate
          </Button>
          <Button
            variant="default"
            size="lg"
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDeactivate}
            disabled={organization.active === false} // Disable if already inactive
          >
            Deactivate
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrganizationDetails;
