import React, { useState } from 'react';
import { useParams } from 'react-router'; // Import useParams
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import axios from '@/api/axios'; // Assuming axios is configured here
import { useAuth } from '@/context/AuthContext';

const AddComplaint = () => {
  const { user } = useAuth()
  const [complaintAgainst, setComplaintAgainst] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post('/api/complaints', {
        complaintAgainst,
        description,
        userId: user.id,
      });
      console.log('Complaint submitted:', response.data);
      setSuccess(true);
      setComplaintAgainst('');
      setDescription('');
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setError('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">Skill Swapper Add Complaint</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto"> {/* Wrap content in a form */}
        <div className="mb-6">
          <Label htmlFor="complaintAgainst" className="block text-gray-700 text-sm font-bold mb-2">
            Complaint Against
          </Label>
          <Textarea
            id="complaintAgainst"
            placeholder="Enter the name or details of the person you are complaining against"
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={complaintAgainst} // Bind value to state
            onChange={(e) => setComplaintAgainst(e.target.value)} // Update state on change
            required // Make field required
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Provide a detailed description of the complaint"
            rows="8"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={description} // Bind value to state
            onChange={(e) => setDescription(e.target.value)} // Update state on change
            required // Make field required
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        {success && <p className="text-green-500 text-xs italic mb-4">Complaint submitted successfully!</p>}
        <div className="flex items-center justify-center">
          <Button
            type="submit" // Change type to submit
            className="hover:bg-primary/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Submitting...' : 'Submit'} {/* Change button text based on loading state */}
          </Button>
        </div>
      </form> {/* Close the form tag */}
    </div>
  );
};

export default AddComplaint;