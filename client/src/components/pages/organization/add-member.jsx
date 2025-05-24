import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import countries from '@/constants/countries';
import axios from '@/api/axios'; // Import axios
import { Toaster, toast } from 'sonner'; // Import toast notifications
import { MultiSelect } from '@/components/multi-select'; // Import MultiSelect

const AddMember = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    password: '',
    gender: 'male', // Default gender
    categories: [], // Add categories field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]); // State for categories
  const [errors, setErrors] = useState({}); // State for validation errors

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        // Assuming the response data is an array of category objects with _id and name
        setCategories(response.data.map(cat => ({ value: cat._id, label: cat.name })));
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Handle error, maybe set an error state
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this runs once on mount


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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, country: value });
  };

  const handleRadioChange = (value) => {
    setFormData({ ...formData, gender: value });
  };

 const handleCategoryChange = (selectedOptions) => {
   setFormData({ ...formData, categories: selectedOptions.map(option => option.value) });
 };

 const validateForm = (data) => {
   const errors = {};
   if (!data.firstName) errors.firstName = 'First Name is required';
   if (!data.lastName) errors.lastName = 'Last Name is required';
   if (!data.email) errors.email = 'Email is required';
   if (!data.phone) errors.phone = 'Phone number is required';
   if (!data.city) errors.city = 'City is required';
   if (!data.country) errors.country = 'Country is required';
   if (!data.password) errors.password = 'Password is required';
   if (!data.gender) errors.gender = 'Gender is required';
   if (!data.categories || data.categories.length === 0) errors.categories = 'Categories are required';
   return errors;
 };


 const handleSubmit = async (e) => {
   e.preventDefault();
   const validationErrors = validateForm(formData);
   setErrors(validationErrors);

   if (Object.keys(validationErrors).length > 0) {
     toast.error('Please fill in all required fields.');
     return;
   }

   setIsSubmitting(true);

   const data = new FormData();
   data.append('name', `${formData.firstName} ${formData.lastName}`);
   data.append('email', formData.email);
   data.append('password', formData.password);
   data.append('phone', formData.phone);
   data.append('city', formData.city);
   data.append('country', formData.country);
   data.append('gender', formData.gender);
   formData.categories.forEach(category => {
     data.append('categories', category);
   });
   if (selectedImage) {
     data.append('profilePicture', selectedImage);
   }

   try {
     const response = await axios.post('/api/organizations/members', data, {
       headers: {
         'Content-Type': 'multipart/form-data',
       },
     });
     toast.success('Member added successfully!');
     // Reset form
     setFormData({
       firstName: '',
       lastName: '',
       email: '',
       phone: '',
       city: '',
       country: '',
       password: '',
       gender: 'male',
       categories: [],
     });
     setSelectedImage(null);
     setImagePreviewUrl('');
     setErrors({}); // Clear errors on success
   } catch (error) {
     console.error("Error adding member:", error);
     const errorMessage = error.response?.data?.msg || error.message || 'Failed to add member.';
     toast.error(errorMessage);
   } finally {
     setIsSubmitting(false);
   }
 };

 return (
   <div className="container mx-auto p-6 text-white min-h-screen">
     <Toaster position="top-right" /> {/* Add Toaster component */}
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
         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="grid gap-2">
             <Label htmlFor="firstName">First Name</Label>
             <Input id="firstName" type="text" placeholder="Enter first name" value={formData.firstName} onChange={handleInputChange} />
             {errors.firstName && <span className="text-red-500">{errors.firstName}</span>}
           </div>
           <div className="grid gap-2">
             <Label htmlFor="lastName">Last Name</Label>
             <Input id="lastName" type="text" placeholder="Enter last name" value={formData.lastName} onChange={handleInputChange} />
             {errors.lastName && <span className="text-red-500">{errors.lastName}</span>}
           </div>
           <div className="grid gap-2">
             <Label htmlFor="email">E-Mail</Label>
             <Input id="email" type="email" placeholder="Enter email" value={formData.email} onChange={handleInputChange} />
             {errors.email && <span className="text-red-500">{errors.email}</span>}
           </div>
           <div className="grid gap-2">
             <Label htmlFor="phone">Phone Number</Label>
             <Input id="phone" type="tel" placeholder="Enter phone number" value={formData.phone} onChange={handleInputChange} />
             {errors.phone && <span className="text-red-500">{errors.phone}</span>}
           </div>
           <div className="grid gap-2">
             <Label htmlFor="city">City</Label>
             <Input id="city" type="text" placeholder="Enter city" value={formData.city} onChange={handleInputChange} />
             {errors.city && <span className="text-red-500">{errors.city}</span>}
           </div>
           <div className="grid gap-2">
             <Label htmlFor="country">Country</Label>
             <Select onValueChange={handleSelectChange} value={formData.country}>
               <SelectTrigger className="w-full" id="country">
                 <SelectValue placeholder="Select country" />
               </SelectTrigger>
               <SelectContent>
                 {countries.map((country) => (
                   <SelectItem key={country} value={country.toLowerCase().replace(/\s+/g, '-')}>
                     {country}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
             {errors.country && <span className="text-red-500">{errors.country}</span>}
           </div>
           <div className="grid gap-2 md:col-span-2">
             <Label htmlFor="password">Create Password</Label>
             <Input id="password" type="password" placeholder="Create password" value={formData.password} onChange={handleInputChange} />
             {errors.password && <span className="text-red-500">{errors.password}</span>}
           </div>
           <div className="grid gap-2 md:col-span-2">
             <Label>Gender</Label>
             <RadioGroup defaultValue="male" className="flex items-center space-x-4" onValueChange={handleRadioChange} value={formData.gender}>
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
             {errors.gender && <span className="text-red-500">{errors.gender}</span>}
           </div>
           <div className="grid gap-2 md:col-span-2">
             <Label>Categories</Label>
             <MultiSelect
               options={categories}
               onValueChange={handleCategoryChange}
               placeholder="Select categories"
               variant="inverted"
               animation={2}
               maxSelected={-1}
             />
             {errors.categories && <span className="text-red-500">{errors.categories}</span>}
           </div>
           <Button type="submit" className="w-full md:col-span-2 " disabled={isSubmitting}>
             {isSubmitting ? 'Adding Member...' : 'Submit'}
           </Button>
         </form>
       </CardContent>
     </Card>
   </div>
 );
};

export default AddMember;
