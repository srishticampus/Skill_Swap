
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import profilepic from "./profile-pic.png";
import { Input } from "@/components/ui/input";

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
  });

  const [errors, setErrors] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState(profilepic);


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


  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, submit data
      console.log('Form data submitted:', formData);
      // Add your submission logic here (e.g., API call)
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.firstName) {
      errors.firstName = 'First name is required';
    }
    if (!data.lastName) {
      errors.lastName = 'Last name is required';
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
    if (!data.newPassword) {
      errors.newPassword = 'Password is required';
    } else if (data.newPassword.length < 6) {
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
    <main className="container mx-3 flex flex-col items-center gap-4 my-16">
        <h1 className="text-center text-primary text-3xl">Sign Up!</h1>
        <label className="flex flex-col items-center justify-center">
        <img src={profilePicPreview} alt="upload profile pic" className="w-48 h-56 object-contain rounded-full" />
        <input type="file" accept="image/*" onChange={handleProfilePicChange} className='hidden' />
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
                <Input type="text" name="country" id="country" value={formData.country} onChange={handleChange} />
                {errors.country && <span className="text-red-500">{errors.country}</span>}
            </label>
            <label htmlFor="city" className="flex flex-col">
                <span>City</span>
                <Input type="text" name="city" id="city" value={formData.city} onChange={handleChange} />
                {errors.city && <span className="text-red-500">{errors.city}</span>}
            </label>
            <label htmlFor="newPassword" className="flex flex-col">
                <span>New Password</span>
                <Input type="password" name="newPassword" id="newPassword" value={formData.newPassword} onChange={handleChange} />
                {errors.newPassword && <span className="text-red-500">{errors.newPassword}</span>}
            </label>
            <label htmlFor="confirmPassword" className="flex flex-col">
                <span>Confirm Password</span>
                <Input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
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
            <Button type="submit" className="sm:col-span-2">Sign Up</Button>
        </form>
        <p>Already have an account? <a href="/login" className="underline">Login</a></p>
    </main>
  );
}
