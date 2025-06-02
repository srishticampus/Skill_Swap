import { useState, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router';
import AuthContext from '@/context/AuthContext';
import axiosInstance from '@/api/axios';
import { Link } from 'react-router';
import countries from '@/constants/countries';

export default function OrgSignup() {
  const [formData, setFormData] = useState({
    name: '', // Changed from organizationName to name
    email: '',
    phone: '',
    country: '',
    city: '',
    password: '', // Changed from newPassword to password
    confirmPassword: '',
    registrationNumber: '', // Added registrationNumber
    address: '', // Added address
    pincode: '', // Added pincode
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(''); // Clear previous success messages
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axiosInstance.post('/api/organizations/register', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          if (response.data.msg) { // Check for the success message from the backend
            setSuccessMessage(response.data.msg);
            setFormData({ // Clear form data on successful submission
              name: '',
              email: '',
              phone: '',
              country: '',
              city: '',
              password: '',
              confirmPassword: '',
              registrationNumber: '',
              address: '',
              pincode: '',
            });
          } else {
            // This block should ideally not be reached if backend always returns msg for pending
            // However, keeping it for robustness in case of future changes or unexpected responses
            const orgData = response.data.organization;
            const token = response.data.token;
            login(orgData, token, true);
            setTimeout(() => {
              navigate('/organization');
            }, 1000);
          }
        } else {
          if (response.data && response.data.errors && response.data.errors.length > 0) {
            setErrors({ api: response.data.errors[0].msg });
          } else {
            setErrors({ api: 'An unexpected error occurred.' });
          }
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
          setErrors({ api: error.response.data.errors[0].msg });
        } else {
          setErrors({ api: 'An error occurred during organization signup.' });
        }
      }
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.name) {
      errors.name = 'Organization Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(data.name)) {
      errors.name = 'Organization Name can only contain letters and spaces';
    }
    if (!data.email) {
      errors.email = 'Please include a valid email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }
    if (!data.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(data.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits and contain only numbers';
    }
    if (!data.country) {
      errors.country = 'Country is required';
    } else if (!/^[A-Za-z\s]+$/.test(data.country)) {
      errors.country = 'Country name can only contain letters and spaces';
    }
    if (!data.city) {
      errors.city = 'City is required';
    } else if (!/^[A-Za-z\s]+$/.test(data.city)) {
      errors.city = 'City name can only contain letters and spaces';
    }
    if (!data.password) {
      errors.password = 'Please enter a password with 6 or more characters';
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!data.address) {
      errors.address = 'Address is required';
    }
    if (!data.pincode) {
      errors.pincode = 'Pincode is required';
    }


    return errors;
  };

  return (
    <main className="container mx-3 md:mx-auto flex flex-col items-center gap-4 my-16">
      <h1 className="text-center text-primary text-3xl">Organization Sign Up!</h1>
      {successMessage && <p className="text-green-500 text-center sm:col-span-2">{successMessage}</p>} {/* Display success message */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-[80%] max-w-[600px]">
        <label htmlFor="name" className="flex flex-col sm:col-span-2">
          <span>Organization Name</span>
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
        <label htmlFor="password" className="flex flex-col relative">
          <span>Password</span>
          <Input type={passwordVisible ? "text" : "password"} name="password" id="password" value={formData.password} onChange={handleChange} />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-3 top-[2.7rem] -translate-y-1/2"
          >
            {passwordVisible ? <EyeIcon className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          {errors.password && <span className="text-red-500">{errors.password}</span>}
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
        <label htmlFor="registrationNumber" className="flex flex-col">
          <span>Registration Number</span>
          <Input type="text" name="registrationNumber" id="registrationNumber" value={formData.registrationNumber} onChange={handleChange} />
          {errors.registrationNumber && <span className="text-red-500">{errors.registrationNumber}</span>}
        </label>
        <label htmlFor="address" className="flex flex-col">
          <span>Address</span>
          <Input type="text" name="address" id="address" value={formData.address} onChange={handleChange} />
          {errors.address && <span className="text-red-500">{errors.address}</span>}
        </label>
        <label htmlFor="pincode" className="flex flex-col">
          <span>Pincode</span>
          <Input type="text" name="pincode" id="pincode" value={formData.pincode} onChange={handleChange} />
          {errors.pincode && <span className="text-red-500">{errors.pincode}</span>}
        </label>
        {errors.api && <span className="text-red-500 sm:col-span-2">{errors.api}</span>}
        <Button type="submit" className="sm:col-span-2">Sign Up</Button>
      </form>
      <p>Already have an organization account? <Link to="/organization/login" className="underline">Login</Link></p>
    </main>
  );
}
