import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MapPin, Phone, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router';

const Members = () => {
  // Dummy data for members
  const members = [
    {
      id: 1,
      name: 'David D',
      gender: 'male',
      email: 'davidd@gmail.com',
      location: 'Trivandrum, India',
      phone: '+91 1234567890',
      requestsHandled: '9+',
      avatarUrl: '/src/assets/profile-pic.png', // Replace with actual image path
    },
    {
      id: 2,
      name: 'David D',
      gender: 'male',
      email: 'davidd@gmail.com',
      location: 'Trivandrum, India',
      phone: '+91 1234567890',
      requestsHandled: '9+',
      avatarUrl: '/src/assets/profile-pic.png', // Replace with actual image path
    },
    {
      id: 3,
      name: 'David D',
      gender: 'male',
      email: 'davidd@gmail.com',
      location: 'Trivandrum, India',
      phone: '+91 1234567890',
      requestsHandled: '9+',
      avatarUrl: '/src/assets/profile-pic.png', // Replace with actual image path
    },
    {
      id: 4,
      name: 'David D',
      gender: 'male',
      email: 'davidd@gmail.com',
      location: 'Trivandrum, India',
      phone: '+91 1234567890',
      requestsHandled: '9+',
      avatarUrl: '/src/assets/profile-pic.png', // Replace with actual image path
    },
  ];

  return (
    <div className="container mx-auto p-6 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">View Member</h1>

      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
          <Input
            type="text"
            placeholder="Search here..."
            className="pl-10 pr-4 py-2 rounded-full bg-white border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
        </div>
        <Link to="/organization/members/add" className="ml-4">
          <Button className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary hover:to-indigo-700 text-white">
            Add New Member
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {members.map((member) => (
          <Card key={member.id} className="bg-white border-gray-200 rounded-lg overflow-hidden">
            <CardContent className="p-6 flex items-center">
              <Avatar className="w-24 h-24 mr-6">
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h2 className="text-xl font-semibold mr-2 border-r-1 border-gray-400 pr-2">{member.name}</h2>
                  <Separator orientation='vertical' className="h-full" />
                  <span className="text-sm text-gray-600">{member.gender}</span>
                </div>
                <p className="text-primary mb-2">{member.email}</p>
                <Separator orientation='horizontal' className="mb-2" />

                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <MapPin size={16} className="mr-1" />
                  <span>{member.location}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <Phone size={16} className="mr-1" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center mb-4">
                  <span className="text-sm text-gray-600 mr-2">Total Request Handled</span>
                  <Badge className="bg-primary text-white rounded-full px-3 py-1 text-xs">{member.requestsHandled}</Badge>
                </div>
                <div className="flex space-x-4 mb-4">
                  <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-purple-900">Active</Button>
                  <Button className="flex-1 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary hover:to-indigo-700 text-white">Deactive</Button>
                </div>
                <div className="text-right">
                  <a href={`/organization/members/details/${member.id}`} className="text-primary hover:underline flex items-center justify-end">
                    View More <ArrowRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Members;
