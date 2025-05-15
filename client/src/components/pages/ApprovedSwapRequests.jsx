import React, { useState } from 'react';
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

const ApprovedSwapRequests = () => {
  const swapRequests = [
    {
      id: 1,
      profilePic: 'https://via.placeholder.com/50',
      name: 'Nikitha',
      category: 'Python, Java',
      skills: 'SDLC',
      deadline: '25 April 2025',
      status: 'Update',
    },
    {
      id: 2,
      profilePic: 'https://via.placeholder.com/50',
      name: 'Nikitha',
      category: 'Python, Java',
      skills: 'SDLC',
      deadline: '25 April 2025',
      status: 'Update',
    },
    {
      id: 3,
      profilePic: 'https://via.placeholder.com/50',
      name: 'Nikitha',
      category: 'Python, Java',
      skills: 'SDLC',
      deadline: '25 April 2025',
      status: 'Update',
    },
    {
      id: 4,
      profilePic: 'https://via.placeholder.com/50',
      name: 'Nikitha',
      category: 'Python, Java',
      skills: 'SDLC',
      deadline: '25 April 2025',
      status: 'Update',
    },
  ];

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('id', {
      header: 'SI No',
    }),
    columnHelper.accessor('profilePic', {
      header: 'Profile Pic',
      cell: info => <img src={info.getValue()} alt="Profile" className="w-10 h-10 rounded-full" />,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('category', {
      header: 'Category',
    }),
    columnHelper.accessor('skills', {
      header: 'Skills',
    }),
    columnHelper.accessor('deadline', {
      header: 'Deadline',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
    }),
    columnHelper.accessor('track', {
      header: 'Track Request',
      cell: () => <div>Track</div>,
    }),
  ];

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
    </div>
  );
};

export default ApprovedSwapRequests;