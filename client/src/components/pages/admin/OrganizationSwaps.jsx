import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from '@/api/axios';
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
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

const FILTERS = ["Posted", "Completed", "Pending"];

const OrganizationSwaps = () => {
  const { organizationId } = useParams();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);

  useEffect(() => {
    const fetchSwaps = async () => {
      try {
        const response = await axios.get(`/api/admin/organizations/${organizationId}/swaps`);
        setSwaps(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching swaps:", err);
        setError(err.message);
        setLoading(false);
        // Setting some dummy data for now
        setSwaps([
          {
            _id: "1",
            profilePic: "https://example.com/profile1.jpg",
            name: "Nikitha",
            description: "I ensure that software application functions correctly",
            category: "Python, Java",
            skills: "SDLC",
            date: "2025-04-05",
            deadline: "2025-04-25",
            status: "Posted",
          },
          {
            _id: "2",
            profilePic: "https://example.com/profile2.jpg",
            name: "Nikitha",
            description: "I ensure that software application functions correctly",
            category: "Python, Java",
            skills: "SDLC",
            date: "2025-04-05",
            deadline: "2025-04-25",
            status: "Completed",
          },
        ]);
      }
    };

    fetchSwaps();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredSwaps = selectedFilter === "All"
    ? swaps
    : swaps.filter((swap) => swap.status === selectedFilter);

  const currentSwaps = filteredSwaps.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // TODO: Implement handleApprove and handleReject functions

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-6">
          <Skeleton className="h-8 w-1/2 mx-auto mb-6" /> {/* Title skeleton */}
          <div className="flex justify-center space-x-4 mb-4">
            {Array.from({ length: FILTERS.length }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
                <TableRow>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <TableHead key={i} className="text-white">
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 10 }).map((_, j) => (
                      <TableCell key={j}>
                        {j === 1 ? (
                          <Skeleton className="w-8 h-8 rounded-full" />
                        ) : (
                          <Skeleton className="h-4 w-full" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <div className="flex">
                <Skeleton className="h-8 w-8 rounded-full mr-2" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-8 rounded-full mr-2" />
                ))}
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
        <h2 className="text-2xl font-semibold text-center text-primary mb-6">Organization Swaps</h2>
        <div className="flex justify-center space-x-4 mb-4">
          {FILTERS.map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
              <TableRow>
                <TableHead className="text-white">Sl No</TableHead>
                <TableHead className="text-white">Profile Pic</TableHead>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Description</TableHead>
                <TableHead className="text-white">Category</TableHead>
                <TableHead className="text-white">Skills</TableHead>
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-white">Deadline</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSwaps.map((swap, index) => (
                <TableRow key={swap._id}>
                  <TableCell className="font-medium">{indexOfFirstItem + index + 1}.</TableCell>
                  <TableCell>
                    <img
                      src={swap.profilePic}
                      alt={swap.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>{swap.name}</TableCell>
                  <TableCell>{swap.description}</TableCell>
                  <TableCell>{swap.category}</TableCell>
                  <TableCell>{swap.skills}</TableCell>
                  <TableCell>{swap.date}</TableCell>
                  <TableCell>{swap.deadline}</TableCell>
                  <TableCell>{swap.status}</TableCell>
                  <TableCell>
                    {/* TODO: Implement approve/reject buttons */}
                    <Button variant="outline" size="sm">Approve</Button>
                    <Button variant="outline" size="sm">Reject</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
              {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, swaps.length)} of {swaps.length}
            </span>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                </PaginationItem>
                {Array.from({ length: Math.ceil(swaps.length / itemsPerPage) }, (_, i) => (
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
                  <PaginationNext onClick={() => paginate(currentPage + 1)} disabled={currentPage * itemsPerPage >= swaps.length} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSwaps;
