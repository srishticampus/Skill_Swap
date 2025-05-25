import React, { useState, useEffect } from 'react';
import axios from '@/api/axios'; // Assuming axios is configured here
import {
  Table,
  TableBody,
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
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

// Dummy data for complaints
const columns = [
  {
    accessorKey: "_id", // Use _id from server response
    header: "Sl No",
    cell: ({ row }) => row.index + 1, // Use row index for serial number
  },
  {
    accessorKey: "userId", // Use userId from server response
    header: "Complaints Given By",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {/* Use profilePicture from userId */}
        {row.original.userId?.profilePicture && (
          <img
            src={`${import.meta.env.VITE_API_URL}/${row.original.userId.profilePicture}`}
            alt={row.original.userId.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        {/* Use name from userId */}
        <span>{row.original.userId?.name || 'N/A'}</span>
      </div>
    ),
  },
  {
    accessorKey: "complaintAgainst",
    header: "Complaints Against",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "status", // Use status from server response
    header: "Status",
    cell: ({ row }) => (
      // Display status directly
      <span>{row.original.status}</span>
    ),
  },
];

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('/api/organizations/complaints');
        setComplaints(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const table = useReactTable({
    data: complaints, // Use fetched complaints data
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10, // Set a default page size, can be adjusted
      },
    },
  });

  if (loading) {
    return <div>Loading complaints...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-primary">View All Complaints</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <Table>
          <TableHeader className="bg-primary text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.original._id} // Use _id for key
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
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
        <div className="flex items-center justify-end space-x-2 py-4">
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
        {/* Manual pagination display based on image */}
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          </Button>
          {/* Render page numbers - simplified for now */}
          {Array.from({ length: table.getPageCount() }, (_, index) => (
            <Button
              key={index}
              variant={table.getState().pagination.pageIndex === index ? "default" : "outline"}
              size="sm"
              onClick={() => table.setPageIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Complaints;
