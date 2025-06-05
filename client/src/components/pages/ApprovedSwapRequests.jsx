import React, { useState, useEffect, useContext, useMemo } from 'react';
import AuthContext from "@/context/AuthContext";
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
import { useNavigate } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';

const ApprovedSwapRequests = () => {
  const [swapRequests, setSwapRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get current user from AuthContext

  useEffect(() => {
    const fetchApprovedSwapRequests = async () => {
      if (!user) {
        setSwapRequests([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/swap-requests/approved');
        setSwapRequests(response.data);
      } catch (error) {
        console.error('Error fetching approved swap requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedSwapRequests();
  }, [user]);

  const handleTrackClick = (swapRequestId) => {
    // Implement navigation to the swap request details page
    navigate(`/swap-requests/${swapRequestId}`);
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

  const columnHelper = createColumnHelper();

  const getUsersForSwapRequest = (currentUser, swapRequest) => {
    let yourUser = null;
    let partnerUser = null;

    console.log('Current User ID (inside getUsersForSwapRequest):', currentUser?.id);
    console.log('Created By ID (inside getUsersForSwapRequest):', swapRequest.createdBy?._id);
    console.log('Interaction User ID (inside getUsersForSwapRequest):', swapRequest.interactionUser?._id);

    if (currentUser?.id === swapRequest.createdBy?._id) {
      yourUser = swapRequest.createdBy;
      partnerUser = swapRequest.interactionUser;
      console.log('Match: Current user is createdBy');
    } else if (currentUser?.id === swapRequest.interactionUser?._id) {
      yourUser = swapRequest.interactionUser;
      partnerUser = swapRequest.createdBy;
      console.log('Match: Current user is interactionUser');
    } else {
      console.log('No match found for current user in swap request');
    }
    return { yourUser, partnerUser };
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('_id', {
        header: 'SI No',
      }),
      columnHelper.accessor('yourProfilePic', {
        header: 'Your Profile Pic',
        cell: ({ row }) => {
          const { yourUser } = getUsersForSwapRequest(user, row.original);
          return yourUser?.profilePicture ? <img src={`${import.meta.env.VITE_API_URL}/${yourUser.profilePicture}`} alt="Your Profile" className="w-10 h-10 rounded-full" /> : 'N/A';
        },
      }),
      columnHelper.accessor('yourName', {
        header: 'Your Name',
        cell: ({ row }) => {
          const { yourUser } = getUsersForSwapRequest(user, row.original);
          return yourUser?.name || 'N/A';
        },
      }),
      columnHelper.accessor('partnerProfilePic', {
        header: 'Partner Profile Pic',
        cell: ({ row }) => {
          const { partnerUser } = getUsersForSwapRequest(user, row.original);
          return partnerUser?.profilePicture ? (
            <img src={`${import.meta.env.VITE_API_URL}/${partnerUser.profilePicture}`} alt="Partner Profile" className="w-10 h-10 rounded-full" />
          ) : (
            'N/A'
          );
        },
      }),
      columnHelper.accessor('partnerName', {
        header: 'Partner Name',
        cell: ({ row }) => {
          const { partnerUser } = getUsersForSwapRequest(user, row.original);
          return partnerUser?.name || 'N/A';
        },
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
    ],
    [user]
  );

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
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-1/3 mb-6 mx-auto" /> {/* Title skeleton */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary text-white">
                {Array.from({ length: 10 }).map((_, i) => ( // Assuming 10 columns
                  <TableHead key={i} className="text-white">
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, i) => ( // Show 4 skeleton rows
                <TableRow key={i}>
                  {Array.from({ length: 10 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-6 w-full" />
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
          <div className="space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">Approved Swap Requests</h1>
        <p className="text-muted-foreground">Please log in to view approved swap requests.</p>
      </div>
    );
  }

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
