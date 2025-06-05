import React, { useState } from 'react';
import { useParams } from 'react-router'; // Import useParams
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import axios from '@/api/axios'; // Assuming axios is configured here
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const AddComplaint = () => {
  const { user } = useAuth();
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

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-8 w-1/2 mx-auto mb-8" /> {/* Skeleton for title */}
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4 mb-2" /> {/* Skeleton for label */}
            <Skeleton className="h-24 w-full" /> {/* Skeleton for textarea */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4 mb-2" /> {/* Skeleton for label */}
            <Skeleton className="h-32 w-full" /> {/* Skeleton for textarea */}
          </div>
          <div className="flex items-center justify-center">
            <Skeleton className="h-10 w-24" /> {/* Skeleton for submit button */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">Skill Swapper Add Complaint</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Label htmlFor="complaintAgainst" className="block text-gray-700 text-sm font-bold mb-2">
            Complaint Against
          </Label>
          <Textarea
            id="complaintAgainst"
            placeholder="Enter the name or details of the person you are complaining against"
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={complaintAgainst}
            onChange={(e) => setComplaintAgainst(e.target.value)}
            required
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        {success && <p className="text-green-500 text-xs italic mb-4">Complaint submitted successfully!</p>}
        <div className="flex items-center justify-center">
          <Button
            type="submit"
            className="hover:bg-primary/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddComplaint;
