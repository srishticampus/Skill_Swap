import React, { useState, useEffect } from 'react';
import axiosInstance from '@/api/axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from API
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <Table>
          <TableCaption>A list of users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Interests</TableHead>
              <TableHead>Bio</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Profile Picture</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Last Login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.skills ? user.skills.join(', ') : ''}</TableCell>
                <TableCell>{user.interests ? user.interests.join(', ') : ''}</TableCell>
                <TableCell>{user.bio}</TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>{user.profilePicture}</TableCell>
                <TableCell>{formatDate(user.date)}</TableCell>
                <TableCell>{formatDate(user.lastLogin)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
};

export default UserManagement;