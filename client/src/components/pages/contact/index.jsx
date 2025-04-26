import { MapPin, Mail, Phone } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import herobg from "./bg.png";
import axiosInstance from '../../api/axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comments: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await axiosInstance.post('/api/contact', {
        name: formData.name,
        email: formData.email,
        message: formData.comments,
      });
      setSuccessMessage(response.data.message);
      setFormData({ name: '', email: '', comments: '' }); // Clear the form
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || 'An error occurred');
      if (error.response?.data?.errors) {
        setErrorMessage(error.response.data.errors.map(err => err.msg).join(', '));
      }
    }
  };

  return (
    <div>
      <section className="container bg-gray-50 mx-auto px-3 lg:px-0 py-12 text-center" style={{ backgroundImage: `url(${herobg})` }}>

        <p>Contact Us</p>
        <h1 className="text-3xl font-semibold leading-snug text-primary my-6">
          We're here to help!
        </h1>
        <p className="text-sm font-light py-2">
          Have a question or need help? We're here to help. Please fill out the
          form below and we'll get back to you as soon as possible.
        </p>
      </section>

      {/* Form */}
      <div className="bg-white">
        <section className="container mx-auto px-3 lg:px-0 py-12">
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <form
              onSubmit={handleSubmit}
              className="flex flex-1 w-full flex-col mx-auto border border-[#ccc] p-6 rounded-2xl"
            >
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
              {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
              <label htmlFor="name">Name</label>
              <Input
                type="text"
                name="name"
                id="name"
                className="mt-1 mb-3"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label htmlFor="email">Email</label>
              <Input
                type="email"
                name="email"
                id="email"
                className="mt-1 mb-3"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="comments">Comments</label>
              <Textarea
                name="comments"
                id="comments"
                cols="30"
                rows="10"
                className="mt-1 mb-3 h-48"
                value={formData.comments}
                onChange={handleChange}
                required
              />
              <Button type="submit">Submit</Button>
            </form>
            {/* Contact info */}
            <div className="flex flex-1 w-full flex-col justify-evenly gap-6 ml-6">
              <div className="flex items-center gap-8 p-6 border border-[#ccc] rounded-2xl">
                <div className="w-16 h-16 rounded-full border border-[#ccc] flex justify-center items-center">
                  <Phone />
                </div>
                <div className="flex flex-col">
                  <p className="text-lg mb-3">+91 123 456 7890</p>
                  <p className="text-sm">Available Monday to Friday</p>
                  <p className="text-sm">9:00am to 5:00pm</p>
                </div>
              </div>
              <div className="flex items-center gap-8 p-6 border border-[#ccc] rounded-2xl">
                <div className="w-16 h-16 rounded-full border border-[#ccc] flex justify-center items-center">
                  <Mail />
                </div>
                <div className="flex flex-col">
                  <p className="text-lg mb-3">skillswap@gmail.com</p>
                  <p className="text-sm">
                    We will respond within 24 hours on weekdays.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-8 p-6 border border-[#ccc] rounded-2xl">
                <div className="w-16 h-16 rounded-full border border-[#ccc] flex justify-center items-center">
                  <MapPin />
                </div>
                <div className="flex flex-col">
                  <p className="text-lg mb-3">
                    Skill Swap Headquarters, 1234 Avenue, Suite 567
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
