
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

  const handleResolve = async (complaintId) => {
    try {
      await axios.put(`/api/admin/complaints/${complaintId}/resolve`);
      // Update the status in the local state
      setComplaints(complaints.map(complaint =>
        complaint._id === complaintId ? { ...complaint, status: 'resolved' } : complaint
      ));
    } catch (err) {
      console.error('Error resolving complaint:', err);
      // Optionally show an error message to the user
    }
  };

  if (loading) {
    return <div>Loading complaints...</div>;
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
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentComplaints.map((complaint, index) => (
                <TableRow key={complaint._id}> {/* Use _id for key */}
                  <TableCell className="font-medium">{indexOfFirstItem + index + 1}.</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {/* Assuming userId is populated and has name and profilePicture */}
                    {complaint.userId?.profilePicture && (
                      <img
                        src={`${import.meta.env.VITE_API_URL}/${complaint.userId.profilePicture}`}
                        alt={complaint.userId.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    {complaint.userId?.name || 'N/A'} {/* Display user name or N/A */}
                  </TableCell>
                  <TableCell>{complaint.complaintAgainst}</TableCell> {/* Use complaintAgainst */}
                  <TableCell>{complaint.description}</TableCell>
                  <TableCell>{complaint.status}</TableCell>
                  <TableCell>
                    {complaint.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolve(complaint._id)}
                      >
                        Resolve
                      </Button>
                    )}
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
