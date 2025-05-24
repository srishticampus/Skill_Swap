import React, { useState, useEffect } from 'react';
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
import UpdateSwapRequestDialog from "@/components/UpdateSwapRequestDialog";
import axiosInstance from "@/api/axios";
const ApprovedSwapRequests = () => {
  const [swapRequests, setSwapRequests] = useState([]);

  useEffect(() => {
    const fetchApprovedSwapRequests = async () => {
      try {
        const response = await axiosInstance.get('/api/swap-requests/approved');
        setSwapRequests(response.data);
      } catch (error) {
        console.error('Error fetching approved swap requests:', error);
      }
    };

    fetchApprovedSwapRequests();
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('_id', {
      header: 'SI No',
    }),
    columnHelper.accessor('createdBy.profilePicture', {
      header: 'Profile Pic',
      cell: info => <img src={`${import.meta.env.VITE_API_URL}/${info.getValue()}`} alt="Profile" className="w-10 h-10 rounded-full" />,
    }),
    columnHelper.accessor('createdBy.name', {
      header: 'Name',
    }),
    columnHelper.accessor('serviceCategory', {
      header: 'Category',
      cell: info => info.getValue().map(cat => cat.name).join(', '),
    }),
    columnHelper.accessor('createdBy.skills', {
      header: 'Skills',
      cell: info => info.getValue() ? info.getValue().join(', ') : '',
    }),
    columnHelper.accessor('deadline', {
      header: 'Deadline',
    }),
    columnHelper.accessor('requestStatus', {
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.requestStatus}</span>
          <Button onClick={() => handleUpdateClick(row.original._id)}>Update</Button>
        </div>
      ),
    }),
    columnHelper.accessor('_id', {
      header: 'Track Request',
      cell: ({ row }) => (
        <Button onClick={() => handleTrackClick(row.original._id)}>Track</Button>
      ),
    }),

  ];

  const handleTrackClick = (swapRequestId) => {
    // Implement navigation to the swap request details page
    window.location.href = `/swap-requests/${swapRequestId}`;
  };

  const [selectedSwapRequestId, setSelectedSwapRequestId] = useState(null);

  const handleUpdateClick = (swapRequestId) => {
    setSelectedSwapRequestId(swapRequestId);
  };

  const handleCloseDialog = () => {
    setSelectedSwapRequestId(null);
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">Approved Swap Requests</h1>
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
      {selectedSwapRequestId && (
        <UpdateSwapRequestDialog
          swapRequestId={selectedSwapRequestId}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default ApprovedSwapRequests;