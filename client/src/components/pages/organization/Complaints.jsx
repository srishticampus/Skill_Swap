import React from 'react';
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
const dummyComplaints = [
  {
    id: 1,
    complaintsGivenBy: { name: "Ashika", avatar: "/client/src/assets/pfp.jpeg" }, // Using a placeholder avatar path
    complaintsAgainst: "Web Designing",
    description: "software application functions correctly and meet specified requirements",
    status: "Resolved", // Assuming status for button text
  },
  {
    id: 2,
    complaintsGivenBy: { name: "Ashika", avatar: "/client/src/assets/pfp.jpeg" },
    complaintsAgainst: "Web Designing",
    description: "software application functions correctly and meet specified requirements",
    status: "Resolved",
  },
  {
    id: 3,
    complaintsGivenBy: { name: "Ashika", avatar: "/client/src/assets/pfp.jpeg" },
    complaintsAgainst: "Web Designing",
    description: "software application functions correctly and meet specified requirements",
    status: "Resolved",
  },
  {
    id: 4,
    complaintsGivenBy: { name: "Ashika", avatar: "/client/src/assets/pfp.jpeg" },
    complaintsAgainst: "Web Designing",
    description: "software application functions correctly and meet specified requirements",
    status: "Resolved",
  },
  // Add more dummy data as needed
];

const columns = [
  {
    accessorKey: "id",
    header: "Sl No",
    cell: ({ row }) => row.index + 1, // Use row index for serial number
  },
  {
    accessorKey: "complaintsGivenBy",
    header: "Complaints Given By",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img src={row.original.complaintsGivenBy.avatar} alt={row.original.complaintsGivenBy.name} className="w-8 h-8 rounded-full" />
        <span>{row.original.complaintsGivenBy.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "complaintsAgainst",
    header: "Complaints Against",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700">
        {row.original.status}
      </Button>
    ),
  },
];

function Complaints() {
  const [data, setData] = React.useState(dummyComplaints);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 4, // Set initial page size to 4 based on the image
      },
    },
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">View All Complaints</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <Table>
          <TableHeader className="bg-purple-600 text-white">
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
                  key={row.id}
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Button>
         </div>
      </div>
    </div>
  );
}

export default Complaints;