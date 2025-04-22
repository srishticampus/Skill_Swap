import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import {  MapPin, Star, BriefcaseBusiness } from "lucide-react"
import axiosInstance from '@/api/axios';

const Marketplace = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/marketplace/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl mb-8">Find a Skill</h2>
        <h2 className="text-3xl mt-8 mb-8">Available Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((exchange) => (
            <div key={exchange._id} className="bg-card rounded-xl overflow-hidden">
              <div className="flex items-start p-4">
                <img
                  src={exchange.profilePicture || "https://via.placeholder.com/150"}
                  alt={exchange.name}
                  className="w-44 h-44 rounded-lg object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-primary">{exchange.name}</h3>
                  <p className="text-sm">{exchange.skills ? exchange.skills.join(", ") : ""}</p>
                  <hr className="my-2" />
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2"><MapPin className="h-5 w-5" /> {exchange.location || "N/A"}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2"><BriefcaseBusiness className="h-5 w-5" />{exchange.yearsOfExperience || "0"} years</p>
                  <p className="text-sm text-muted-foreground flex"> {
                    new Array(5).fill(0).map((_, i) => {
                      return (
                        <Star
                          key={i}
                          className={`h-5 w-5 text-yellow-500 ${i+1 < (exchange.rating || 0) ? "fill-current" : ""}`}
                          aria-hidden="true"
                        />
                      )
                    })
                  }</p>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marketplace;