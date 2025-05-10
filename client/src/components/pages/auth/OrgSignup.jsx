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
  const [passwordVisible, setPasswordVisible] = useState(false); // Changed from newPasswordVisible to passwordVisible
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, submit data
      try {
        const response = await axiosInstance.post('/api/organizations/register', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const orgData = response.data.organization; // Assuming the response contains organization data
          const token = response.data.token;
          // Need to update AuthContext to handle organization login
          // For now, assuming login function can handle both user and org data
          login(orgData, token, true); // Pass true to indicate organization login
          setTimeout(() => {
            navigate('/organization'); // Redirect to organization dashboard or home page after successful signup
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
        setErrors({ api: 'An error occurred during organization signup.' }); // Display generic error message
      }
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.name) { // Changed from organizationName to name
      errors.name = 'Organization Name is required'; // Updated error message key
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
    if (!data.password) { // Changed from newPassword to password
      errors.password = 'Please enter a password with 6 or more characters'; // Updated error message key
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters long"; // Updated error message key
    }
    if (data.password !== data.confirmPassword) { // Changed from newPassword to password
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!data.address) { // Added validation for address
      errors.address = 'Address is required';
    }
    if (!data.pincode) { // Added validation for pincode
      errors.pincode = 'Pincode is required';
    }


    return errors;
  };

  return (
    <main className="container mx-3 md:mx-auto flex flex-col items-center gap-4 my-16">
      <h1 className="text-center text-primary text-3xl">Organization Sign Up!</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-[80%] max-w-[600px]">
        <label htmlFor="name" className="flex flex-col sm:col-span-2"> {/* Changed htmlFor and name */}
          <span>Organization Name</span>
          <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} /> {/* Changed name and value */}
          {errors.name && <span className="text-red-500">{errors.name}</span>} {/* Updated error key */}
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
        <label htmlFor="password" className="flex flex-col relative"> {/* Changed htmlFor and name */}
          <span>Password</span> {/* Changed label text */}
          <Input type={passwordVisible ? "text" : "password"} name="password" id="password" value={formData.password} onChange={handleChange} /> {/* Changed name and value, and type toggle state */}
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-3 top-[2.7rem] -translate-y-1/2"
          >
            {passwordVisible ? <EyeIcon className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />} {/* Changed icon toggle state */}
          </button>
          {errors.password && <span className="text-red-500">{errors.password}</span>} {/* Updated error key */}
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
        {/* Added new fields for organization registration */}
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
        {errors.api && <span className="text-red-500 sm:col-span-2">{errors.api}</span>} {/* Display API error */}
        <Button type="submit" className="sm:col-span-2">Sign Up</Button>
      </form>
      <p>Already have an organization account? <Link to="/organization/login" className="underline">Login</Link></p>
    </main>
  );
}
