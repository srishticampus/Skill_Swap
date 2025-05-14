import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; // Import useNavigate
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';
import axiosInstance from '../../api/axios';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook

function SwapRequests() {
  const { user } = useAuth(); // Get the current user
  const [swapRequests, setSwapRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  const columnHelper = createColumnHelper(); // Move columnHelper inside the component

  const columns = [ // Move columns inside the component
    columnHelper.accessor('_id', { // Use _id from MongoDB
      header: 'Sl No',
      cell: info => info.row.index + 1 + '.',
    }),
    columnHelper.accessor('serviceTitle', {
      header: 'Title',
    }),
    columnHelper.accessor('serviceCategory', {
      header: 'Category',
      cell: info => {
        const categories = info.getValue();
        console.log(categories)
        // Check if categories is an array and map to get category names
        return Array.isArray(categories) && categories.length > 0
          ? categories.map(category => category.name).join(', ')
          : 'N/A';
      },
    }),
    columnHelper.accessor('serviceRequired', {
      header: 'Service Required',
    }),
    columnHelper.accessor('serviceDescription', {
      header: 'Description',
    }),
    columnHelper.accessor('yearsOfExperience', {
      header: 'Years of Experience',
      cell: info => (info.getValue()!== undefined || info.getValue() !== null) ? info.getValue() : 'N/A',
    }),
    columnHelper.accessor('preferredLocation', {
      header: 'Location',
      cell: info => info.getValue() || 'N/A',
    }),
    columnHelper.accessor('deadline', {
      header: 'Deadline',
      cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : 'N/A',
    }),
    columnHelper.accessor('createdBy.email', {
      header: 'Contact Email',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original._id)}>
            <Pencil className="h-4 w-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original._id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    }),
  ];

  useEffect(() => {
      fetchSwapRequests();
    
  }, []); 

  const fetchSwapRequests = async () => {
    try {
      setLoading(true);
      // Fetch swap requests only for the current user
      console.log(user)
      const response = await axiosInstance.get(`/api/swap-requests?createdBy=${user.id}`);
      console.log('Fetched swap requests data:', response.data); // Log the fetched data
      setSwapRequests(response.data);
      toast.success('Swap requests loaded.');
    } catch (error) {
      console.error('Error fetching swap requests:', error);
      toast.error('Failed to load swap requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    console.log('Attempting to delete swap request with ID:', id); // Log ID for debugging
    try {
      await axiosInstance.delete(`/api/swap-requests/${id}`);
      toast.success('Swap request deleted successfully.');
      fetchSwapRequests();
    } catch (error) {
      console.error('Error deleting swap request:', error);
      toast.error('Failed to delete swap request.');
    }
  };

  const handleEdit = (id) => {
    console.log('Attempting to edit swap request with ID:', id); // Log ID for debugging
    // Navigate to an edit page, assuming a route like /edit-swap-request/:id exists
    navigate(`/edit-swap-request/${id}`);
    toast.info(`Navigating to edit page for ID ${id}.`);
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: swapRequests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  if (loading) {
    return <div className="container mx-auto py-10 text-center">Loading swap requests...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">Posted Swaps</h1>
      <div className="rounded-md border">
        <Table rel={false}>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="bg-primary hover:bg-primary/90 text-white">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-white">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border rounded p-1 text-sm"
          >
            {[4, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>
        <div className="flex-1 text-sm text-muted-foreground text-right">
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of{" "}
          {table.getFilteredRowModel().rows.length}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SwapRequests;