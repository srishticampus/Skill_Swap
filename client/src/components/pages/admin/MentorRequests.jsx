import { useState, useEffect } from 'react';
import axiosInstance from '@/api/axios';
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

export default function MentorRequests() {
  const [mentorRequests, setMentorRequests] = useState([]);

  useEffect(() => {
    const fetchMentorRequests = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/mentor-requests');
        setMentorRequests(response.data);
      } catch (error) {
        console.error("Error fetching mentor requests:", error);
      }
    };

    fetchMentorRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/api/admin/mentor-requests/${id}/approve`);
      // Refresh the mentor requests after approving
      const response = await axiosInstance.get('/api/admin/mentor-requests');
      setMentorRequests(response.data);
    } catch (error) {
      console.error("Error approving mentor request:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.put(`/api/admin/mentor-requests/${id}/reject`);
      // Refresh the mentor requests after rejecting
      const response = await axiosInstance.get('/api/admin/mentor-requests');
      setMentorRequests(response.data);
    } catch (error) {
      console.error("Error rejecting mentor request:", error);
    }
  };

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h2 className="text-2xl font-semibold mb-4">Mentor Requests</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Qualifications</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mentorRequests.map((request) => (
              <TableRow key={request._id}>
                <TableCell>{request.user.name} ({request.user.email})</TableCell>
                <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{request.requestText}</TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleApprove(request._id)}>Approve</Button>
                  <Button variant="destructive" onClick={() => handleReject(request._id)}>Reject</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}