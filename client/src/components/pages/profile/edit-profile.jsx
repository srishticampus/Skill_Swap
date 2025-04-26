import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import profilepic from "@/assets/profile-pic.png";
import { Input } from "@/components/ui/input";
import axiosInstance from '@/api/axios';
import { toast } from 'sonner';

export default function EditProfile({setIsEditModalOpen}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    newPassword: '',
    confirmPassword: '',
    gender: '',
    profilePic: null,
  });

  const [errors, setErrors] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState(profilepic);

  useEffect(() => {
    // Simulate fetching user data. Replace with your actual data fetching logic.
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/profile');
        const userData = response.data;
        setFormData(userData);
        setProfilePicPreview(userData.profilePicture || profilepic);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchUserData();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFormData({ ...formData, profilePic: file });
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicPreview(reader.result);
        };
        reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, submit data
      try {
        const formDataToSend = new FormData();
        for (const key in formData) {
          formDataToSend.append(key, formData[key]);
        }
        const response = await axiosInstance.post('/api/auth/update-profile', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setIsEditModalOpen(false);
        toast.success(
          "Profile updated successfully!",
          {description: "Your profile has been updated."},
        )

      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.name) {
      errors.name = 'Name is required';
    }
    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }
    if (!data.phone) {
        errors.phone = 'Phone number is required';
    }
    if (!data.country) {
        errors.country = 'Country is required';
    }
    if (!data.city) {
        errors.city = 'City is required';
    }
    if (data.newPassword && data.newPassword.length < 6) {
        errors.newPassword = "Password must be at least 6 characters long";
    }
    if (data.newPassword !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!data.gender) {
        errors.gender = 'Gender is required';
    }

    return errors;
  };

  return (
    <div className=" flex flex-col items-center gap-4">
        <label className="flex flex-col items-center justify-center">
        <img src={profilePicPreview} alt="upload profile pic" className="w-32 h-32 object-contain rounded-full" />
        <input type="file" accept="image/*" onChange={handleProfilePicChange} className='hidden' />
        </label>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <label htmlFor="name" className="flex flex-col">
                <span>Name</span>
                <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} />
                {errors.name && <span className="text-red-500">{errors.name}</span>}
            </label>
            <label htmlFor="email" className="flex flex-col">
                <span>Email</span>
                <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="text-red-500">{errors.email}</span>}
            </label>
            <label htmlFor="phone" className="flex flex-col">
                <span>Phone Number</span>
                <Input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} />
                {errors.phone && <span className="text-red-500">{errors.phone}</span>}
            </label>
            <label htmlFor="country" className="flex flex-col">
                <span>Country</span>
                <Input type="text" name="country" id="country" value={formData.country} onChange={handleChange} />
                {errors.country && <span className="text-red-500">{errors.country}</span>}
            </label>
            <label htmlFor="city" className="flex flex-col">
                <span>City</span>
                <Input type="text" name="city" id="city" value={formData.city} onChange={handleChange} />
                {errors.city && <span className="text-red-500">{errors.city}</span>}
            </label>
            <div className="flex flex-col sm:col-span-2">
                <span>Gender</span>
                <div className="flex gap-4">
                    <label htmlFor="male" className="flex items-center">
                        <Input type="radio" id="male" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} />
                        <span className="ml-2">Male</span>
                    </label>
                    <label htmlFor="female" className="flex items-center">
                        <Input type="radio" id="female" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} />
                        <span className="ml-2">Female</span>
                    </label>
                    <label htmlFor="other" className="flex items-center">
                        <Input type="radio" id="other" name="gender" value="other" checked={formData.gender === 'other'} onChange={handleChange} />
                        <span className="ml-2">Other</span>
                    </label>
                </div>
                {errors.gender && <span className="text-red-500">{errors.gender}</span>}
            </div>
            <Button type="submit" className="sm:col-span-2">Update Profile</Button>
        </form>
    </div>
  );
}
