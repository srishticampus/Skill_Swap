import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "@/api/axios";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming a table component exists based on other ui components
import { Button } from "@/components/ui/button"; // Assuming a button component exists
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; // Assuming dropdown exists
import { Eye } from "lucide-react"; // Using Eye icon for View More

const organizationData = [
  {
    slNo: 1,
    name: "Skill Gain Org Pvt Ltd.",
    registerNumber: "reg122356",
    email: "skillgainorg@gmail.com",
    approvedDate: "12 April 2001",
    link: "View Organization Swaps",
  },
  {
    slNo: 2,
    name: "Skill Gain Org Pvt Ltd.",
    registerNumber: "reg122356",
    email: "skillgainorg@gmail.com",
    approvedDate: "12 April 2001",
    link: "View Organization Swaps",
  },
  {
    slNo: 3,
    name: "Skill Gain Org Pvt Ltd.",
    registerNumber: "reg122356",
    email: "skillgainorg@gmail.com",
    approvedDate: "12 April 2001",
    link: "View Organization Swaps",
  },
  {
    slNo: 4,
    name: "Skill Gain Org Pvt Ltd.",
    registerNumber: "reg122356",
    email: "skillgainorg@gmail.com",
    approvedDate: "12 April 2001",
    link: "View Organization Swaps",
  },
];

function Organizations() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]); // State to hold fetched organizations
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  const [currentPage, setCurrentPage] = useState(1);

  const handleViewPendingRequests = () => {
    navigate("/admin/organization-requests");
  };

  const [itemsPerPage, setItemsPerPage] = useState(4); // Matching the design's "Show 4 per page"

  // Calculate total items and total pages based on fetched data
  const totalItems = organizations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Fetch organizations from the API
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await axiosInstance.get('/api/admin/organizations'); // Adjust API endpoint if necessary
        setOrganizations(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-primary">View Organization Swaps</h2>
        <Button onClick={handleViewPendingRequests}>View Pending Requests</Button>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <Table>
          <TableHeader className="bg-primary text-white">
            <TableRow className="border-b border-primary">
              <TableHead className="text-white">Sl No</TableHead>
              <TableHead className="text-white">Organization Name</TableHead>
              <TableHead className="text-white">Register Number</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Approved Date</TableHead>
              <TableHead className="text-white">Link</TableHead>
              <TableHead className="text-white text-center">View More</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Loading organizations...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-red-500">Error loading organizations: {error.message}</TableCell>
              </TableRow>
            ) : organizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No organizations found.</TableCell>
              </TableRow>
            ) : (
              // Map over fetched organizations and render rows
              organizations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((org, index) => (
                <TableRow key={org._id}> {/* Use _id as the key */}
                  {/* Calculate Sl No based on current page and index */}
                  <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}.</TableCell>
                  <TableCell>{org.name}</TableCell>
                  <TableCell>{org.registerNumber}</TableCell>
                  <TableCell>{org.email}</TableCell>
                  {/* Format the approved date (assuming createdAt field exists) */}
                  <TableCell>{org.createdAt ? new Date(org.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                  {/* Link column - keeping placeholder or removing based on requirement */}
                  {/* This column doesn't directly map to API data, removing or adding a placeholder */}
                  {/* <TableCell className="text-blue-600 hover:underline cursor-pointer">{org.link || 'N/A'}</TableCell> */}
                   <TableCell>N/A</TableCell> {/* Placeholder as there's no 'link' in API */}
                  <TableCell className="text-center">
                      <Button
                          variant="ghost"
                          size="sm"
                          // Use organization._id for the navigation link
                          onClick={() => navigate(`/admin/organizations/details/${org._id}`)}
                      >
                          <Eye className="h-5 w-5 text-primary" />
                      </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <DropdownMenu onValueChange={handleItemsPerPageChange}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-1">
                        {itemsPerPage}
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => handleItemsPerPageChange(4)}>4</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleItemsPerPageChange(10)}>10</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleItemsPerPageChange(20)}>20</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <span>per page</span>
          </div>

          <div className="flex items-center gap-2">
            <span>{`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems}`}</span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &larr;
            </Button>
            {/* Basic pagination numbers - can be expanded */}
            {[...Array(totalPages)].map((_, i) => (
                <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i + 1)}
                    className={currentPage === i + 1 ? "bg-primary text-white hover:bg-primary/90" : ""}
                >
                    {i + 1}
                </Button>
            ))}
            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &rarr;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Organizations;
