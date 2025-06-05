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
import { MultiSelect } from '@/components/multi-select';

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
    categories: [], // Add categories field
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]); // State for categories

  useEffect(() => {
    const fetchUserDataAndCategories = async () => {
      try {
        // Fetch user data
        const userResponse = await axiosInstance.get('/api/auth/profile');
        const userData = userResponse.data;
        setFormData(userData);

        // Fetch categories
        const categoryResponse = await axiosInstance.get('/api/categories');
        setCategories(categoryResponse.data.map(category => ({
          value: category._id,
          label: category.name,
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserDataAndCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleCategoryChange = (selectedOptions) => {
    setFormData({ ...formData, categories: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const formDataToSend = new FormData();
        for (const key in formData) {
          if (key === 'categories') {
            formData[key].forEach(category => {
              formDataToSend.append(key, category);
            });
          } else {
            formDataToSend.append(key, formData[key]);
          }
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
    }
  };

  const validateForm = (data) => {
    const errors = {};
    const textRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s,.'-]*$/; // Requires at least one letter, allows alphanumeric, spaces, commas, periods, hyphens

    const qualificationsString = Array.isArray(data.qualifications)
      ? data.qualifications.join(', ')
      : String(data.qualifications || '');

    if (!qualificationsString.trim()) {
      errors.qualifications = 'Qualifications are required.';
    } else if (!textRegex.test(qualificationsString)) {
      errors.qualifications = 'Qualifications should contain descriptive text, not just numbers or special characters.';
    }

    const skillsString = Array.isArray(data.skills)
      ? data.skills.join(', ')
      : String(data.skills || '');

    if (!skillsString.trim()) {
      errors.skills = 'Skills are required.';
    } else if (!textRegex.test(skillsString)) {
      errors.skills = 'Skills should contain descriptive text, not just numbers or special characters.';
    }

    if (!data.categories || data.categories.length === 0) {
      errors.categories = 'Categories are required';
    }
    return errors;
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
              {errors.qualifications && <span className="text-red-500 text-sm">{errors.qualifications}</span>}
            </label>


            <label htmlFor="skills" className="flex flex-col col-span-2">
              <span>Skills</span>
              <Input type="text" name="skills" id="skills" value={formData.skills} onChange={handleChange} />
              {errors.skills && <span className="text-red-500 text-sm">{errors.skills}</span>}
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

            <div className="flex flex-col col-span-2" style={{ zIndex: 50 }}>
              <span>Categories</span>
              {categories.length > 0 ? (
                <MultiSelect
                  options={categories}
                  onValueChange={handleCategoryChange}
                  placeholder="Select categories"
                  variant="inverted"
                  maxSelected={-1}
                  maxCount={1}
                  search={false}
                  defaultValue={formData.categories}
                  modalPopover={true}
                />
              ) : (
                <div>Loading categories...</div>
              )}
              {errors.categories && <span className="text-red-500">{errors.categories}</span>}
            </div>

            <label htmlFor="serviceDescription" className="flex flex-col col-span-2">
              <span>Service Description</span>
              <Textarea name="serviceDescription" id="serviceDescription" value={formData.serviceDescription} onChange={handleChange} />
            </label>

          <Button type="submit" className="col-span-2">Update</Button>
        </form>
      </div>
  );
}
