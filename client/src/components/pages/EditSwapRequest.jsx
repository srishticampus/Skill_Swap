import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axiosInstance from '../../api/axios';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from '../multi-select'; // Import MultiSelect
import { Skeleton } from '../ui/skeleton'; // Import Skeleton

function EditSwapRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [swapRequest, setSwapRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]); // State for fetched categories
  const [loadingCategories, setLoadingCategories] = useState(true); // Loading state for categories
  const [formData, setFormData] = useState({
    serviceTitle: '',
    serviceCategory: [], // Change to array for MultiSelect
    serviceRequired: '',
    serviceDescription: '',
    yearsOfExperience: '',
    preferredLocation: '',
    deadline: '',
    contactDetails: '', // Assuming this maps to createdBy.email or similar
  });

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axiosInstance.get('/api/categories');
        setCategories(response.data.map(category => ({ value: category._id, label: category.name })));
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories.');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []); // Fetch categories on component mount

  useEffect(() => {
    const fetchSwapRequest = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/swap-requests/${id}`);
        setSwapRequest(response.data);
        // Populate form data with fetched data
        setFormData({
          serviceTitle: response.data.serviceTitle || '',
          serviceCategory: response.data.serviceCategory?.map(cat => cat._id) || [], // Set as array of IDs for MultiSelect
          serviceRequired: response.data.serviceRequired || '',
          serviceDescription: response.data.serviceDescription || '',
          yearsOfExperience: response.data.yearsOfExperience || '',
          preferredLocation: response.data.preferredLocation || '',
          deadline: response.data.deadline ? new Date(response.data.deadline).toISOString().split('T')[0] : '', // Format for date input
          contactDetails: response.data.createdBy?.email || '', // Adjust based on actual structure
        });
        toast.success('Swap request data loaded.');
      } catch (error) {
        console.error('Error fetching swap request:', error);
        toast.error('Failed to load swap request data.');
        // Optionally navigate back or show an error message
        // navigate('/swap-requests');
      } finally {
        setLoading(false);
      }
    };

    fetchSwapRequest();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Adjust payload structure if needed based on backend API
      const payload = {
        serviceTitle: formData.serviceTitle,
        serviceCategory: formData.serviceCategory, // Send array of IDs
        serviceRequired: formData.serviceRequired,
        serviceDescription: formData.serviceDescription,
        yearsOfExperience: formData.yearsOfExperience,
        preferredLocation: formData.preferredLocation,
        deadline: formData.deadline,
        // contactDetails: formData.contactDetails, // Contact details might not be editable
      };
      await axiosInstance.put(`/api/swap-requests/${id}`, payload);
      toast.success('Swap request updated successfully.');
      navigate('/swap-requests'); // Navigate back to the list after successful update
    } catch (error) {
      console.error('Error updating swap request:', error);
      toast.error('Failed to update swap request.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-10 text-center">Loading swap request data...</div>;
  }

  if (!swapRequest) {
    return <div className="container mx-auto py-10 text-center">Swap request not found.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">Edit Posted Swaps</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="serviceTitle">Service Title</Label>
          <Input id="serviceTitle" name="serviceTitle" value={formData.serviceTitle} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceCategory">Service Category</Label>
          {loadingCategories ? ( // Show skeleton while loading
            <Skeleton className="h-10 w-full" />
          ) : (
            <MultiSelect
              options={categories}
              onValueChange={(value) => setFormData(prevState => ({ ...prevState, serviceCategory: value }))}
              defaultValue={formData.serviceCategory}
              placeholder="Select categories"
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceRequired">Service Required</Label>
          <Input id="serviceRequired" name="serviceRequired" value={formData.serviceRequired} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceDescription">Service Description</Label>
          <Textarea id="serviceDescription" name="serviceDescription" value={formData.serviceDescription} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearsOfExperience">Year of Experience</Label>
          <Input id="yearsOfExperience" name="yearsOfExperience" type="number" value={formData.yearsOfExperience} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredLocation">Location</Label>
          <Input id="preferredLocation" name="preferredLocation" value={formData.preferredLocation} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deadline">Dead Line</Label>
          <Input id="deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactDetails">Contact Details</Label>
          {/* Contact details might not be editable, displaying as read-only */}
          <Input id="contactDetails" name="contactDetails" value={formData.contactDetails} readOnly disabled />
        </div>
        <div className="md:col-span-2 flex justify-center">
          <Button type="submit" disabled={loading}>Submit</Button>
        </div>
      </form>
    </div>
  );
}

export default EditSwapRequest;