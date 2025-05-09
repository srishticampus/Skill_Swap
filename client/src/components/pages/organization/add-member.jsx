import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


const AddMember = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedImage(null);
      setImagePreviewUrl('');
    }
  };

  return (
    <div className="container mx-auto p-6 text-white min-h-screen">
      <Card className="max-w-3xl mx-auto bg-white border-gray-200 rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">Add Member</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            <Label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={imagePreviewUrl} alt="Member Avatar" />
                <AvatarFallback className="bg-gray-200 text-gray-600 text-4xl">
                  <Plus size={40} />
                </AvatarFallback>
              </Avatar>
              <span className="mt-2 text-sm text-gray-600">+ Add Image</span>
            </Label>
            <Input
              id="imageUpload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" type="text" placeholder="Enter first name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" type="text" placeholder="Enter last name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" placeholder="Enter email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="Enter phone number" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" type="text" placeholder="Enter city" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Select>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add country options here */}
                  <SelectItem value="usa">USA</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  {/* Add more countries as needed */}
                </SelectContent>
              </Select>
            </div>
             <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="password">Create Password</Label>
              <Input id="password" type="password" placeholder="Create password" />
            </div>
             <div className="grid gap-2 md:col-span-2">
              <Label>Gender</Label>
               <RadioGroup defaultValue="male" className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                 <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full md:col-span-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMember;