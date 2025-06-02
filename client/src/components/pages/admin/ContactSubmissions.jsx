import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton";

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axiosInstance.get('/api/contact');
        setSubmissions(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error.response?.data?.message || 'Failed to fetch submissions');
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/contact/${id}`);
      setSubmissions(submissions.filter(submission => submission._id !== id));
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Failed to delete submission');
    }
  };

  if (loading) {
    return (
      <main className="flex-1 px-6 pb-6">
        <div className="bg-white rounded-lg h-full p-6">
          <Skeleton className="h-8 w-64 mb-4" /> {/* For "Category Management" title */}
          <div className="container mx-auto py-10">
            <Skeleton className="h-10 w-80 mb-6" /> {/* For "Contact Form Submissions" title */}
            <Table>
              <TableCaption>
                <Skeleton className="h-4 w-full" />
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <Skeleton className="h-6 w-24" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-6 w-32" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-6 w-48" />
                  </TableHead>
                  <TableHead className="text-right">
                    <Skeleton className="h-6 w-20" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => ( // Show 5 skeleton rows
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-48" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <Skeleton className="h-6 w-48 mx-auto" />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <main className="flex-1 px-6 pb-6">
    <div className="bg-white rounded-lg h-full p-6">
      <h2 className="text-2xl font-semibold mb-4">Category Management</h2>
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Contact Form Submissions</h1>
      <Table>
        <TableCaption>A list of your recent contact form submissions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission._id}>
              <TableCell className="font-medium">{submission.name}</TableCell>
              <TableCell>{submission.email}</TableCell>
              <TableCell>{submission.message}</TableCell>
              <TableCell className="text-right">
                <Button variant="destructive" size="sm" onClick={() => handleDelete(submission._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              Total Submissions: {submissions.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
    </div>
    </main>
  );
};

export default ContactSubmissions;
