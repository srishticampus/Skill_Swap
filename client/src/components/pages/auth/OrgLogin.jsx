import { useState, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import AuthContext from '@/context/AuthContext';
import axiosInstance from '@/api/axios';

export default function OrgLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
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
        const response = await axiosInstance.post('/api/organizations/login', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const token = response.data.token;
          const orgData = response.data.organization; // Assuming the response contains organization data
          // Need to update AuthContext to handle organization login
          // For now, assuming login function can handle both user and org data
          login(orgData, token, true); // Pass true to indicate organization login
          navigate('/organization'); // Redirect to organization dashboard after successful login
        } else {
          setErrors({ api: response.data.message }); // Display error message from the API
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          setErrors({ api: error.response.data.errors[0].msg }); // Display specific error message from the API
        } else {
          setErrors({ api: 'An error occurred during organization login.' }); // Display generic error message
        }
      }
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }
    if (!data.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  return (
    <main className="container mx-3 md:mx-auto flex flex-col items-center gap-4 my-20">
      <h1 className="text-center text-primary text-3xl">Organization Login</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 w-[80%] max-w-[400px]">
        <label htmlFor="email" className="flex flex-col">
          <span>Email</span>
          <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </label>
        <label htmlFor="password" className="flex flex-col relative">
          <span>Password</span>
          <Input type={passwordVisible ? "text" : "password"} name="password" id="password" value={formData.password} onChange={handleChange} />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-8 top-[2.7rem] -translate-y-1/2"
          >
            {passwordVisible ? <EyeIcon className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <Link to="/organization/forgot-password" className="ms-auto mt-2 underline">Forgot Password?</Link>
          {errors.password && <span className="text-red-500">{errors.password}</span>}
        </label>
        {errors.api && <span className="text-red-500">{errors.api}</span>} {/* Display API error */}
        <Button type="submit">Login</Button>
      </form>
      <div className="flex flex-col items-center gap-2">
        <p>Don't have an organization account? <Link to="/organization/signup" className="underline">Sign Up</Link></p>
      </div>
    </main>
  );
}
