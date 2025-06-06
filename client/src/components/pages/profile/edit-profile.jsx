import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import profilepic from "@/assets/profile-pic.png";
import { Input } from "@/components/ui/input";
import axiosInstance from '@/api/axios';
import { toast } from 'sonner';
import { MultiSelect } from '@/components/multi-select'; // Import MultiSelect
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

export default function EditProfile({ setIsEditModalOpen, onProfileUpdate }) {
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
    categories: [], // Add categories field
  });

  const [errors, setErrors] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState(profilepic);
  const [categories, setCategories] = useState([]); // State for categories
  const [loadingCategories, setLoadingCategories] = useState(true); // Loading state for categories

  useEffect(() => {
    const fetchUserDataAndCategories = async () => {
      try {
        // Fetch user data
        const userResponse = await axiosInstance.get('/api/auth/profile');
        const userData = userResponse.data;
        setFormData(userData);
        setProfilePicPreview(userData.profilePicture || profilepic);

        // Fetch categories
        setLoadingCategories(true);
        const categoryResponse = await axiosInstance.get('/api/categories');
        setCategories(categoryResponse.data.map(category => ({
          value: category._id,
          label: category.name,
        })));
        console.log("Fetched Categories:", categoryResponse.data.map(category => ({
          value: category._id,
          label: category.name,
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchUserDataAndCategories();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (selectedOptions) => {
    console.log("Selected Categories:", selectedOptions);
    setFormData({ ...formData, categories: selectedOptions });
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
    console.log(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log(categories, formData)
      // Form is valid, submit data
      try {
        const formDataToSend = new FormData();
        for (const key in formData) {
          if (key === 'categories') {
            // Append each category ID individually for arrays
            formData[key].forEach(category => {
              formDataToSend.append(key, category);
            });
          } else {
            formDataToSend.append(key, formData[key]);
          }

        }

        const response = await axiosInstance.post('/api/auth/update-profile', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setIsEditModalOpen(false);
        toast.success(
          "Profile updated successfully!",
          { description: "Your profile has been updated." },
        )
        if (onProfileUpdate) {
          onProfileUpdate(); // Call the callback function
        }

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
    } else if (/^0/.test(data.phone)) {
      errors.phone = 'Phone number cannot start with zero';
    }
    if (!data.country) {
      errors.country = 'Country is required';
    } else if (/\d/.test(data.country)) {
      errors.country = 'Country name cannot contain digits';
    }
    if (!data.city) {
      errors.city = 'City is required';
    } else if (/\d/.test(data.city)) {
      errors.city = 'City name cannot contain digits';
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
    if (!data.categories || data.categories.length === 0) {
      errors.categories = 'Categories are required';
    }


    return errors;
  };

  return (
    <div className=" flex flex-col items-center gap-4">
      <label className="flex flex-col items-center justify-center">
        <img src={profilePicPreview} alt="upload profile pic" className="w-32 h-32 object-contain rounded-full" />
        <input type="file" accept="image/*" onChange={handleProfilePicChange} className='hidden' />
      </label>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
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
          <select name="country" id="country" value={formData.country} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="">Select Country</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="UK">UK</option>
            <option value="Australia">Australia</option>
            {/* Add more countries as needed */}
          </select>
          {errors.country && <span className="text-red-500">{errors.country}</span>}
        </label>
        <label htmlFor="city" className="flex flex-col">
          <span>City</span>
          <Input type="text" name="city" id="city" value={formData.city} onChange={handleChange} />
          {errors.city && <span className="text-red-500">{errors.city}</span>}
        </label>
        <div className="flex flex-col" style={{ zIndex: 50 }}> {/* Removed sm:col-span-2 */}
          <span>Categories</span>
          {categories.length > 0 ? (
            <MultiSelect
              options={categories}
              onValueChange={handleCategoryChange}
              placeholder="Select categories"
              variant="inverted"
              // animation={2}
              maxSelected={-1}
              maxCount={1}
              search={false}
              defaultValue={formData.categories}
              modalPopover={true} // Set modalPopover to true
            />
          ) : (
            <Skeleton className="h-10 w-full" />
          )}
          {errors.categories && <span className="text-red-500">{errors.categories}</span>}
        </div>
        <div className="flex flex-col sm:col-span-2"> {/* Moved Gender below Categories */}
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
