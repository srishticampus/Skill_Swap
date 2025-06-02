import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel, // Import getFilteredRowModel for search
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
import { Input } from "@/components/ui/input"; // Import Input for search bar
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from 'lucide-react'; // Import Search icon
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/api/axios';

const placeholderSwaps = [
  {
    _id: 'placeholder1',
    createdBy: { name: 'John Doe' },
    serviceCategory: [{ name: 'Programming' }, { name: 'Design' }],
    serviceTitle: 'React Component Help',
    serviceDescription: 'Need help with building a complex React component.',
    deadline: '2025-12-31T00:00:00.000Z',
    requestedTo: { name: 'Jane Smith' },
    status: 'Open',
  },
  {
    _id: 'placeholder2',
    createdBy: { name: 'Jane Smith' },
    serviceCategory: [{ name: 'Writing' }],
    serviceTitle: 'Blog Post Review',
    serviceDescription: 'Review and edit a blog post about software engineering.',
    deadline: '2025-11-15T00:00:00.000Z',
    requestedTo: null, // Example of null requestedTo
    status: 'Pending',
  },
  {
    _id: 'placeholder3',
    createdBy: { name: 'Peter Jones' },
    serviceCategory: [{ name: 'Marketing' }],
    serviceTitle: 'Social Media Strategy',
    serviceDescription: 'Develop a social media strategy for a new product launch.',
    deadline: '2026-01-31T00:00:00.000Z',
    requestedTo: { name: 'John Doe' },
    status: 'Completed',
  },
];

function ViewAllSwaps() {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState(''); // State for search input
  const navigate = useNavigate();

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('_id', {
      header: 'Sl No',
      cell: info => info.row.index + 1 + '.',
    }),
    columnHelper.accessor('createdBy.name', { // Assuming createdBy has a name field
      header: 'Requested By',
    }),
    columnHelper.accessor('serviceCategory', {
      header: 'Category',
      cell: info => {
        const categories = info.getValue();
        return Array.isArray(categories) && categories.length > 0
          ? categories.map(category => category.name).join(', ')
          : 'N/A';
      },
    }),
    columnHelper.accessor('serviceTitle', { // Using serviceTitle for Skill based on image context
      header: 'Skill',
    }),
    columnHelper.accessor('serviceDescription', {
      header: 'Description',
    }),
    columnHelper.accessor('deadline', {
      header: 'Deadline',
      cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : 'N/A',
    }),
    columnHelper.accessor('requestedTo.name', { // Assuming requestedTo has a name field
      header: 'Requested To',
      cell: info => info.getValue() || 'N/A', // Handle cases where requestedTo might be null
    }),
    columnHelper.accessor('status', { // Assuming a status field exists
      header: 'Status',
    }),
  ];

  useEffect(() => {
    fetchAllSwaps();
  }, []);

  const fetchAllSwaps = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/organizations/swaps');
      setSwaps(response.data);
    } catch (error) {
      console.error('Error fetching organization swaps:', error);
      // Optionally set an error state to display a message to the user
    } finally {
      setLoading(false);
    }
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: swaps,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      globalFilter, // Add globalFilter to table state
    },
    onGlobalFilterChange: setGlobalFilter, // Add global filter handler
    getFilteredRowModel: getFilteredRowModel(), // Enable filtering
  });

  if (loading) {
    return (
      <div className="container mx-auto py-10 w-[calc(100vw-var(--sidebar-width)-50px)]">
        <Skeleton className="h-8 w-1/3 mb-6 mx-auto" /> {/* For the "Posted Swaps" title */}
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-full max-w-md rounded-md" /> {/* For search input */}
        </div>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary text-white">
                {columns.map((column, index) => (
                  <TableHead key={index} className="text-white">
                    <Skeleton className="h-5 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-8 w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 w-[calc(100vw-var(--sidebar-width)-50px)]">
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">Posted Swaps</h1>
      {/* Search Bar */}
      <div className="flex items-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search a Swap here..."
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-full"
          />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto ">
        <Table>
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

export default ViewAllSwaps;
