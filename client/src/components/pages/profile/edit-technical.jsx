import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils';
import axiosInstance from '@/api/axios';
import { toast } from 'sonner';

export default function EditTechnicalInfo({ className, setIsTechModalOpen, onProfileUpdate }) {
  const [formData, setFormData] = useState({
    resume: null,
    qualifications: '',
    skills: '',
    experienceLevel: '',
    yearsOfExperience: '',
    serviceDescription: '',
    responseTime: '',
    availability: '',
  });

  useEffect(() => {
    // Simulate fetching user data. Replace with your actual data fetching logic.
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/profile');
        const userData = response.data;
        setFormData(userData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
          formDataToSend.append(key, formData[key]);
      }
      const response = await axiosInstance.post('/api/auth/update-technical', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Technical information updated successfully:', response.data);
      toast.success("Success",{description:"Technical information updated successfully"});
      if (onProfileUpdate) {
        onProfileUpdate(); // Call the callback function
      }
      setIsTechModalOpen(false)
      // Optionally, update the profile data in the parent component or context
    } catch (error) {
      console.error('Error updating technical information:', error);
    }
  };

  return (
      <div className={cn("overflow-y-scroll max-h-[70vh] scrollbar-thin ", className)}>
      <form onSubmit={handleSubmit} className={cn(`grid grid-cols-1 md:grid-cols-2 gap-4`)}>

            <label htmlFor="resume" className="flex flex-col">
              <span>Resume</span>
              <Input type="file" name="resume" id="resume" onChange={handleChange} />
            </label>


            <label htmlFor="qualifications" className="flex flex-col">
              <span>Qualifications</span>
              <Input type="text" name="qualifications" id="qualifications" value={formData.qualifications} onChange={handleChange} />
            </label>


            <label htmlFor="skills" className="flex flex-col col-span-2">
              <span>Skills</span>
              <Input type="text" name="skills" id="skills" value={formData.skills} onChange={handleChange} />
            </label>


            <label htmlFor="experienceLevel" className="flex flex-col">
              <span>Experience Level</span>
              <Input type="text" name="experienceLevel" id="experienceLevel" value={formData.experienceLevel} onChange={handleChange} />
            </label>


            <label htmlFor="yearsOfExperience" className="flex flex-col">
              <span>Years of Experience</span>
              <Input type="number" name="yearsOfExperience" id="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} />
            </label>

            <label htmlFor="responseTime" className="flex flex-col">
              <span>Response Time</span>
              <Input type="text" name="responseTime" id="responseTime" value={formData.responseTime} onChange={handleChange} />
            </label>

            <label htmlFor="availability" className="flex flex-col">
              <span>Availability</span>
              <Input type="text" name="availability" id="availability" value={formData.availability} onChange={handleChange} />
            </label>


            <label htmlFor="serviceDescription" className="flex flex-col col-span-2">
              <span>Service Description</span>
              <Textarea name="serviceDescription" id="serviceDescription" value={formData.serviceDescription} onChange={handleChange} />
            </label>

          <Button type="submit" className="col-span-2">Update</Button>
        </form>
      </div>
  );
}
