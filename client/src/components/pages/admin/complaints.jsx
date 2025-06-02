
import React, { useState, useEffect } from 'react';
import axios from '@/api/axios'; // Assuming axios is configured here
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 items per page

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('/api/admin/complaints');
        setComplaints(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Calculate current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = complaints.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleChangeStatus = async (complaintId, newStatus) => {
    try {
      await axios.put(`/api/admin/complaints/${complaintId}/status`, { status: newStatus });
      setComplaints(complaints.map(complaint =>
        complaint._id === complaintId ? { ...complaint, status: newStatus } : complaint
      ));
    } catch (err) {
      console.error('Error updating complaint status:', err);
      // Optionally show an error message to the user
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-6">
          <Skeleton className="h-8 w-64 mx-auto mb-6" /> {/* Title skeleton */}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
                <TableRow>
                  <TableHead className="text-white">
                    <Skeleton className="h-6 w-16" />
                  </TableHead>
                  <TableHead className="text-white">
                    <Skeleton className="h-6 w-32" />
                  </TableHead>
                  <TableHead className="text-white">
                    <Skeleton className="h-6 w-32" />
                  </TableHead>
                  <TableHead className="text-white">
                    <Skeleton className="h-6 w-48" />
                  </TableHead>
                  <TableHead className="text-white">
                    <Skeleton className="h-6 w-24" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(itemsPerPage)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-6 w-12" />
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-24" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination and Items per page Skeletons */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-32" />
              <div className="flex">
                <Skeleton className="h-8 w-8 rounded-full mr-2" />
                <Skeleton className="h-8 w-8 rounded-full mr-2" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-primary mb-6">View All Complaints</h2>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
              <TableRow>
                <TableHead className="text-white">Sl No</TableHead>
                <TableHead className="text-white">Complaints Given By</TableHead>
                <TableHead className="text-white">Complaints Against</TableHead>
                <TableHead className="text-white">Description</TableHead>
                <TableHead className="text-white">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentComplaints.map((complaint, index) => (
                <TableRow key={complaint._id}>
                  <TableCell className="font-medium">{indexOfFirstItem + index + 1}.</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {complaint.userId?.profilePicture && (
                      <img
                        src={`${import.meta.env.VITE_API_URL}/${complaint.userId.profilePicture}`}
                        alt={complaint.userId.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    {complaint.userId?.name || 'N/A'}
                  </TableCell>
                  <TableCell>{complaint.complaintAgainst}</TableCell>
                  <TableCell>{complaint.description}</TableCell>
                  <TableCell>
                    <Select
                      value={complaint.status}
                      onValueChange={(newStatus) => handleChangeStatus(complaint._id, newStatus)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination and Items per page */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border rounded p-1"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>per page</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, complaints.length)} of {complaints.length}
            </span>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                </PaginationItem>
                {Array.from({ length: Math.ceil(complaints.length / itemsPerPage) }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => paginate(i + 1)}
                      isActive={i + 1 === currentPage}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => paginate(currentPage + 1)} disabled={currentPage * itemsPerPage >= complaints.length} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageComplaints;
