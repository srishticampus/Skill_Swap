
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOff } from 'lucide-react';
import { Link } from 'react-router';

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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
      console.log('Reset password data submitted:', formData);
      // Add your submission logic here (e.g., API call)
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.password) {
      errors.password = 'Password is required';
    }
    if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!data.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    }
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  return (
    <main className="container mx-3 flex flex-col items-center gap-4 my-20">
      <h1 className="text-center text-primary text-3xl">Reset Password!</h1>
      <p>Enter your new password to reset.</p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 w-[80%] max-w-[400px]">
        <label htmlFor="password" className="flex flex-col relative">
          <span>New Password</span>
          <Input type={passwordVisible ? "text" : "password"} name="password" id="password" value={formData.password} onChange={handleChange} />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-8 top-[2.7rem] -translate-y-1/2"
          >
            {passwordVisible ? <EyeIcon className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          {errors.password && <span className="text-red-500">{errors.password}</span>}
        </label>
        <label htmlFor="confirmPassword" className="flex flex-col relative">
          <span>Confirm New Password</span>
          <Input type={confirmPasswordVisible ? "text" : "password"} name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          <button
            type="button"
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            className="absolute right-8 top-[2.7rem] -translate-y-1/2"
          >
            {confirmPasswordVisible ? <EyeIcon className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword}</span>}
        </label>
        <Button type="submit">Reset Password</Button>
      </form>
      <div className="flex flex-col items-center gap-2">
        <p>Remember your password? <Link to="/login" className="underline">Login</Link></p>
      </div>
    </main>
  );
}
