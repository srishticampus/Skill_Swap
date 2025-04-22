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

export default function EditTechnicalInfo({ className }) {
  const [formData, setFormData] = useState({
    resume: null,
    qualifications: '',
    skills: '',
    experienceLevel: '',
    yearsOfExperience: '',
    serviceDescription: '',
    certifications: [],
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

  const handleCertificationChange = (index, e) => {
    if(!e.target){
      const newCertifications = [...formData.certifications];
      newCertifications[index] = {
        ...newCertifications[index],
        type: e,
      };
      setFormData({ ...formData, certifications: newCertifications });
      return;
    }
    const { name, value, files } = e.target;
    const newCertifications = [...formData.certifications];
    newCertifications[index] = {
      ...newCertifications[index],
      [name]: files ? files[0] : value,
    };
    setFormData({ ...formData, certifications: newCertifications });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, { type: 'text', value: '' }],
    });
  };

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
      const response = await axiosInstance.post('/api/auth/update-technical', formData);
      console.log('Technical information updated successfully:', response.data);
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

            <div className="col-span-2 flex flex-col gap-2">
              <span>Certifications</span>
              {formData.certifications.map((certification, index) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <label htmlFor={`certifications-${index}-type`} className="flex flex-col">
                    <span>Type</span>
                    <Select
                      name="type"
                      id={`certifications-${index}-type`}

                      onValueChange={(e) => handleCertificationChange(index, e)}
                      value={certification.type || 'file'}
                    >
                      <SelectTrigger className="w-full">
                         <SelectValue  placeholder="Type" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="text">Text</SelectItem>
                         <SelectItem value="file">File</SelectItem>
                         <SelectItem value="url">URL</SelectItem>
                       </SelectContent>
                    </Select>
                  </label>
                  {certification.type === 'file' && (
                      <label htmlFor={`certifications-${index}-file`} className="flex flex-col">
                        <span>File</span>
                        <Input type="file" name="value" id={`certifications-${index}-file`} onChange={(e) => handleCertificationChange(index, e)} />
                      </label>
                    )}
                    {certification.type === 'text' && (
                      <label htmlFor={`certifications-${index}-text`} className="flex flex-col">
                        <span>Text</span>
                        <Input type="text" name="value" id={`certifications-${index}-text`} onChange={(e) => handleCertificationChange(index, e)} value={certification.value} />
                      </label>
                    )}
                    {certification.type === 'url' && (
                      <label htmlFor={`certifications-${index}-url`} className="flex flex-col">
                        <span>URL</span>
                        <Input type="text" name="value" id={`certifications-${index}-url`} onChange={(e) => handleCertificationChange(index, e)} value={certification.value} />
                      </label>
                    )}
                </div>
              ))}
              <Button type="button" onClick={addCertification} variant="outline" className="w-min mx-auto">Add Certification</Button>
            </div>

          {/* <Button type="submit" className="col-span-2">Update</Button> */}
        </form>
      </div>
  );
}
