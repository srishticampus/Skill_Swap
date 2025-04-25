import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import {  MapPin, Star, BriefcaseBusiness } from "lucide-react"
import axiosInstance from '@/api/axios';

const Marketplace = () => {
  const [swapRequests, setSwapRequests] = useState([]);

  useEffect(() => {
    const fetchSwapRequests = async () => {
      try {
        const response = await axiosInstance.get('/api/swap-requests');
        setSwapRequests(response.data);
      } catch (error) {
        console.error("Error fetching swap requests:", error);
      }
    };

    fetchSwapRequests();
  }, []);

  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl mb-8">Find a Skill</h2>
        <h2 className="text-3xl mt-8 mb-8">Available Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {swapRequests.length === 0 ? (
            <p>No requests available</p>
          ) : (
            swapRequests.map((request) => (
              <div key={request._id} className="bg-card rounded-xl overflow-hidden">
                <div className="flex items-start p-4">
                  {/* Replace with appropriate image or icon */}
                  <img
                    src={"https://via.placeholder.com/150"}
                    alt={request.serviceTitle}
                    className="w-44 h-44 rounded-lg object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-primary">{request.serviceTitle}</h3>
                    <p className="text-sm">{request.serviceCategory ? request.serviceCategory.join(", ") : ""}</p>
                    <hr className="my-2" />
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2"><MapPin className="h-5 w-5" /> {request.preferredLocation || "N/A"}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2"><BriefcaseBusiness className="h-5 w-5" />{request.yearsOfExperience || "0"} years</p>
                    {/* Remove star rating as it's not relevant to swap requests */}
                  </div>
                </div>

                <div className="flex justify-between p-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">
                    Place a Request
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Marketplace;