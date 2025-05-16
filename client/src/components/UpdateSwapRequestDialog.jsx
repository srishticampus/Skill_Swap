import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import axiosInstance from "@/api/axios";

const UpdateSwapRequestDialog = ({ swapRequestId, onClose }) => {
  const [updateContent, setUpdateContent] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAddUpdate = async () => {
    try {
      await axiosInstance.post(`/api/swap-requests/${swapRequestId}/update`, { updateContent });
      onClose(); // Close the dialog after successful update
    } catch (error) {
      console.error('Error adding status update:', error);
    }
  };

  const handleMarkAsCompleted = async () => {
    try {
      await axiosInstance.put(`/api/swap-requests/${swapRequestId}/complete`, {});
      onClose(); // Close the dialog after successful completion
    } catch (error) {
      console.error('Error marking as completed:', error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Update</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Swap Request</AlertDialogTitle>
          <AlertDialogDescription>
            Add a status update or mark this request as completed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea value={updateContent} onChange={(e) => setUpdateContent(e.target.value)} placeholder="Add a status update..." />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAddUpdate}>Add Update</AlertDialogAction>
          <AlertDialogAction onClick={handleMarkAsCompleted}>Mark as Completed</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateSwapRequestDialog;