import React, { useState, useEffect } from 'react';
import axiosInstance from '@/api/axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone, Key, Calendar, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const OrganizationRequests = () => {
  const [organizationRequests, setOrganizationRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrganizationRequests();
  }, []);

  const fetchOrganizationRequests = async () => {
    try {
      setLoading(true);
      // Adjust API endpoint as needed
      const response = await axiosInstance.get('api/admin/organizations/pending');
      setOrganizationRequests(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching organization requests:", err);
      setError(err.response?.data?.message || 'Failed to fetch organization requests');
      setLoading(false);
    }
  };

  const filteredRequests = organizationRequests.filter(request =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    // Add other fields if needed for search
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/api/admin/organizations/approve/${id}`);
      setOrganizationRequests(organizationRequests.filter(org => org._id !== id));
    } catch (err) {
      console.error("Error approving organization:", err);
      // Handle error, e.g., show a toast notification
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.put(`/api/admin/organizations/reject/${id}`);
      setOrganizationRequests(organizationRequests.filter(org => org._id !== id));
    } catch (err) {
      console.error("Error rejecting organization:", err);
      // Handle error
    }
  };

  if (loading) {
    return (
      <main className="flex-1 px-6 pb-6">
        <div className="bg-white rounded-lg h-full p-6">
          <h2 className="text-2xl font-semibold mb-4">Organization Requests</h2>
          <div>Loading organization requests...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 px-6 pb-6">
        <div className="bg-white rounded-lg h-full p-6">
          <h2 className="text-2xl font-semibold mb-4">Organization Requests</h2>
          <div style={{ color: 'red' }}>Error: {error}</div>
        </div>
      </main>
    );
  }


  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h2 className="text-2xl font-semibold mb-4">Organization Requests</h2>

        <div className="flex justify-end mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map(request => (
            <Card key={request._id}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-purple-800">{request.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {request.phone}</p>
                <p className="flex items-center gap-2"><Key className="h-4 w-4" /> {request.registrationNumber}</p>
                <p className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {formatDate(request.createdAt)}</p>
                {/* Assuming there's a specific page to view details */}
                <Button variant="outline" className="w-full mt-4" asChild>
                   {/* Replace with actual link structure */}
                  <Link to={`/admin/organizations/details/${request._id}`}>View More</Link>
                </Button>
                <div className="flex gap-2 mt-4">
                  <Button variant="default" className="flex-1" onClick={() => handleApprove(request._id)}>Approve</Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleReject(request._id)}>Reject</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Optional: "View More" link at the bottom */}
        {/* You could add pagination logic here if needed */}
        {/*
        <div className="flex justify-end mt-6">
          <Button variant="link" className="flex items-center gap-1">
            View More <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        */}
      </div>
    </main>
  );
};

export default OrganizationRequests;
