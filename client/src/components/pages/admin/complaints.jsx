
import React, { useState } from 'react';
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

// Dummy data for complaints (replace with API call later)
const complaints = [
  {
    id: 1,
    givenBy: { name: "Ashika", avatar: "/path/to/ashika-avatar.png" }, // Replace with actual path or URL
    against: "Web Designing",
    description: "software application functions correctly and meet specified requirements",
    status: "Resolved", // Assuming 'Resolved' status based on button label
  },
  {
    id: 2,
    givenBy: { name: "Ashika", avatar: "/path/to/ashika-avatar.png" },
    against: "Web Designing",
    description: "software application functions correctly and meet specified requirements",
    status: "Resolved",
  },
  {
    id: 3,
    givenBy: { name: "Ashika", avatar: "/path/to/ashika-avatar.png" },
    against: "Web Designing",
    description: "software application functions correctly and meet specified requirements",
    status: "Resolved",
  },
  {
    id: 4,
    givenBy: { name: "Ashika", avatar: "/path/to/ashika-avatar.png" },
    against: "Web Designing",
    description: "software application functions correctly and meet specified requirements",
    status: "Resolved",
  },
  // Add more dummy data as needed
];

const ManageComplaints = () => {
  // Basic state for pagination (can be expanded)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Based on the image

  // Calculate current items to display (simple slicing for dummy data)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = complaints.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6"> {/* Adjusted padding to fit within layout */}
      <div className="bg-white rounded-lg p-6"> {/* White container with padding */}
        <h2 className="text-2xl font-semibold text-center text-purple-700 mb-6">View All Complaints</h2> {/* Styled title */}

        <div className="overflow-x-auto"> {/* Ensure responsiveness for table */}
          <Table>
            {/* <TableCaption>A list of recent complaints.</TableCaption> */}
            <TableHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white"> {/* Styled header */}
              <TableRow>
                <TableHead className="text-white">Sl No</TableHead>
                <TableHead className="text-white">Complaints Given By</TableHead>
                <TableHead className="text-white">Complaints Against</TableHead>
                <TableHead className="text-white">Description</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentComplaints.map((complaint, index) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{indexOfFirstItem + index + 1}.</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {/* Assuming avatar is available */}
                    {complaint.givenBy.avatar && (
                      <img
                        src={complaint.givenBy.avatar}
                        alt={complaint.givenBy.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    {complaint.givenBy.name}
                  </TableCell>
                  <TableCell>{complaint.against}</TableCell>
                  <TableCell>{complaint.description}</TableCell>
                  <TableCell>
                    <Button variant="outline" className="bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900">
                      {complaint.status}
                    </Button>
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
              <option value={4}>4</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>per page</span>
          </div>

          <div className="flex items-center gap-4">
             {/* Placeholder text for item range */}
            <span className="text-gray-600">
              {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, complaints.length)} of {complaints.length}
            </span>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                </PaginationItem>
                {/* Simple pagination for dummy data */}
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
