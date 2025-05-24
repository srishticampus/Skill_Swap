import { useState, useContext, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import profilepic from "@/assets/profile-pic.png";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router';
import AuthContext from '@/context/AuthContext';
import axiosInstance from '@/api/axios';
import { Link } from 'react-router';
import countries from '@/constants/countries';
import { MultiSelect } from '@/components/multi-select'; // Import MultiSelect

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [categories, setCategories] = useState([]); // State for categories
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/api/categories');
        // Assuming the response data is an array of category objects with _id and name
        setCategories(response.data.map(cat => ({ value: cat._id, label: cat.name })));
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Handle error, maybe set an error state
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this runs once on mount


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (selectedOptions) => {
    setFormData({ ...formData, categories: selectedOptions.map(option => option.value) });
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

        const response = await axiosInstance.post('/api/auth/signup', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // Allow 2xx and 4xx status codes to be handled
          validateStatus: function (status) {
            return status >= 200 && status < 300 || status >= 400 && status < 500;
          },
        });

        // Now check response.status here
        if (response.status === 200) {
          const userData = response.data;
          login(userData,userData.token); // Update AuthContext with user data
          setTimeout(() => {
            navigate('/profile'); // Redirect to profile page after successful signup
          }, 1000);
        } else {
          // Check if the error response has the expected format
          if (response.data && response.data.errors && response.data.errors.length > 0) {
            setErrors({ api: response.data.errors[0].msg }); // Display the first error message from the API
          } else {
            setErrors({ api: 'An unexpected error occurred.' }); // Fallback generic error message
          }
        }
      } catch (error) {
        setErrors({ api: 'An error occurred during signup.' }); // Display generic error message
      }
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.firstName) {
      errors.firstName = 'First Name is required';
    }
    if (!data.lastName) {
      errors.lastName = 'Last Name is required';
    }
    if (!data.email) {
      errors.email = 'Please include a valid email';
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
    if (!data.newPassword) {
      errors.newPassword = 'Please enter a password with 6 or more characters';
    } else if (data.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters long";
    }
    if (data.newPassword !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!data.gender) {
      errors.gender = 'Gender is required';
    }
    if (!data.profilePic) {
      errors.profilePic = 'Profile picture is required';
    }
    if (!data.categories || data.categories.length === 0) {
      errors.categories = 'Categories are required';
    }


    return errors;
  };

  return (
    <main className="container mx-3 md:mx-auto flex flex-col items-center gap-4 my-16">
      <h1 className="text-center text-primary text-3xl">Sign Up!</h1>
      <label className="flex flex-col items-center justify-center">
        <img src={profilePicPreview} alt="upload profile pic" className="w-48 h-56 object-contain rounded-full" />
        <input type="file" accept="image/*" onChange={handleProfilePicChange} className='hidden' />
        {errors.profilePic && <span className="text-red-500">{errors.profilePic}</span>}
      </label>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-[80%] max-w-[600px]">
        <label htmlFor="firstName" className="flex flex-col">
          <span>First Name</span>
          <Input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} />
          {errors.firstName && <span className="text-red-500">{errors.firstName}</span>}
        </label>
        <label htmlFor="lastName" className="flex flex-col">
          <span>Last Name</span>
          <Input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} />
          {errors.lastName && <span className="text-red-500">{errors.lastName}</span>}
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
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && <span className="text-red-500">{errors.country}</span>}
        </label>
        <label htmlFor="city" className="flex flex-col">
          <span>City</span>
          <Input type="text" name="city" id="city" value={formData.city} onChange={handleChange} />
          {errors.city && <span className="text-red-500">{errors.city}</span>}
        </label>
        <label htmlFor="newPassword" className="flex flex-col relative">
          <span>New Password</span>
          <Input type={newPasswordVisible ? "text" : "password"} name="newPassword" id="newPassword" value={formData.newPassword} onChange={handleChange} />
          <button
            type="button"
            onClick={() => setNewPasswordVisible(!newPasswordVisible)}
            className="absolute right-3 top-[2.7rem] -translate-y-1/2"
          >
            {newPasswordVisible ? <EyeIcon className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          {errors.newPassword && <span className="text-red-500">{errors.newPassword}</span>}
        </label>
        <label htmlFor="confirmPassword" className="flex flex-col relative">
          <span>Confirm Password</span>
          <Input type={confirmPasswordVisible ? "text" : "password"} name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          <button
            type="button"
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            className="absolute right-3 top-[2.7rem] -translate-y-1/2"
          >
            {confirmPasswordVisible ? <EyeIcon className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword}</span>}
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
        <div className="flex flex-col sm:col-span-2">
          <span>Categories</span>
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
        {errors.api && <span className="text-red-500">{errors.api}</span>} {/* Display API error */}
        <Button type="submit" className="sm:col-span-2">Sign Up</Button>
      </form>
      <div className="flex flex-col items-center gap-2">
        <p>Already have an account? <Link to="/login" className="underline">Login</Link></p>
        <p>Or, <Link to="/organization/signup" className="underline">sign up as an organization</Link></p>
      </div>
    </main>
  );
}
