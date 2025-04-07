
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOff } from 'lucide-react';
import { Link } from 'react-router';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, submit data
      console.log('Login data submitted:', formData);
      // Add your submission logic here (e.g., API call)
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
    <main className="container mx-3 flex flex-col items-center gap-4 my-20">
        <h1 className="text-center text-primary text-3xl">Login</h1>
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
                <Link to="/forgot-password" className="ms-auto mt-2 underline">Forgot Password?</Link>
                {errors.password && <span className="text-red-500">{errors.password}</span>}
            </label>
            <Button type="submit">Login</Button>
        </form>
        <div className="flex flex-col items-center gap-2">
            <p>Don't have an account? <a href="/signup" className="underline">Sign Up</a></p>
        </div>
    </main>
  );
}
