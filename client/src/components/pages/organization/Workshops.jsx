import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../ui/dialog';
import { format } from 'date-fns';
import axios from '../../../api/axios';
import { toast } from 'sonner';

const Workshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [newWorkshop, setNewWorkshop] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: ''
  });
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingRsvps, setViewingRsvps] = useState(null);
  const [isRsvpDialogOpen, setIsRsvpDialogOpen] = useState(false);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await axios.get('/api/organizations/workshops/my');
      setWorkshops(response.data);
    } catch (error) {
      console.error('Error fetching workshops:', error);
      toast.error('Failed to fetch workshops.');
    }
  };

  const handleNewWorkshopChange = (e) => {
    const { name, value } = e.target;
    setNewWorkshop(prev => ({ ...prev, [name]: value }));
  };

  const handleEditWorkshopChange = (e) => {
    const { name, value } = e.target;
    setEditingWorkshop(prev => ({ ...prev, [name]: value }));
  };

  const createWorkshop = async () => {
    try {
      await axios.post('/api/organizations/workshops', newWorkshop);
      toast.success('Workshop created successfully!');
      setNewWorkshop({ title: '', description: '', date: '', time: '', location: '', maxAttendees: '' });
      setIsDialogOpen(false);
      fetchWorkshops();
    } catch (error) {
      console.error('Error creating workshop:', error);
      toast.error('Failed to create workshop.');
    }
  };

  const updateWorkshop = async () => {
    try {
      await axios.put(`/api/organizations/workshops/${editingWorkshop._id}`, editingWorkshop);
      toast.success('Workshop updated successfully!');
      setEditingWorkshop(null);
      setIsEditDialogOpen(false);
      fetchWorkshops();
    } catch (error) {
      console.error('Error updating workshop:', error);
      toast.error('Failed to update workshop.');
    }
  };

  const deleteWorkshop = async (id) => {
    if (window.confirm('Are you sure you want to delete this workshop?')) {
      try {
        await axios.delete(`/api/organizations/workshops/${id}`);
        toast.success('Workshop deleted successfully!');
        fetchWorkshops();
      } catch (error) {
        console.error('Error deleting workshop:', error);
        toast.error('Failed to delete workshop.');
      }
    }
  };

  const openEditDialog = (workshop) => {
    setEditingWorkshop({
      ...workshop,
      date: format(new Date(workshop.date), 'yyyy-MM-dd'), // Format date for input type="date"
      maxAttendees: workshop.maxAttendees === null ? '' : workshop.maxAttendees // Handle null maxAttendees
    });
    setIsEditDialogOpen(true);
  };

  const openRsvpDialog = (rsvpList) => {
    setViewingRsvps(rsvpList);
    setIsRsvpDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Manage Workshops</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Workshop</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workshop</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input id="title" name="title" value={newWorkshop.title} onChange={handleNewWorkshopChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea id="description" name="description" value={newWorkshop.description} onChange={handleNewWorkshopChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">Date</Label>
                  <Input id="date" name="date" type="date" value={newWorkshop.date} onChange={handleNewWorkshopChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">Time</Label>
                  <Input id="time" name="time" type="time" value={newWorkshop.time} onChange={handleNewWorkshopChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">Location</Label>
                  <Input id="location" name="location" value={newWorkshop.location} onChange={handleNewWorkshopChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maxAttendees" className="text-right">Max Attendees (Optional)</Label>
                  <Input id="maxAttendees" name="maxAttendees" type="number" value={newWorkshop.maxAttendees} onChange={handleNewWorkshopChange} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={createWorkshop}>Create Workshop</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workshops.map((workshop) => (
                <TableRow key={workshop._id}>
                  <TableCell className="font-medium">{workshop.title}</TableCell>
                  <TableCell>{format(new Date(workshop.date), 'PPP')}</TableCell>
                  <TableCell>{workshop.time}</TableCell>
                  <TableCell>{workshop.location}</TableCell>
                  <TableCell>
                    {workshop.rsvpList.length}
                    {workshop.maxAttendees && ` / ${workshop.maxAttendees}`}
                    <Button variant="link" onClick={() => openRsvpDialog(workshop.rsvpList)}>View RSVPs</Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => openEditDialog(workshop)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteWorkshop(workshop._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Workshop Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Workshop</DialogTitle>
          </DialogHeader>
          {editingWorkshop && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">Title</Label>
                <Input id="edit-title" name="title" value={editingWorkshop.title} onChange={handleEditWorkshopChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">Description</Label>
                <Textarea id="edit-description" name="description" value={editingWorkshop.description} onChange={handleEditWorkshopChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">Date</Label>
                <Input id="edit-date" name="date" type="date" value={editingWorkshop.date} onChange={handleEditWorkshopChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-time" className="text-right">Time</Label>
                <Input id="edit-time" name="time" type="time" value={editingWorkshop.time} onChange={handleEditWorkshopChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">Location</Label>
                <Input id="edit-location" name="location" value={editingWorkshop.location} onChange={handleEditWorkshopChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-maxAttendees" className="text-right">Max Attendees (Optional)</Label>
                <Input id="edit-maxAttendees" name="maxAttendees" type="number" value={editingWorkshop.maxAttendees} onChange={handleEditWorkshopChange} className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={updateWorkshop}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RSVP List Dialog */}
      <Dialog open={isRsvpDialogOpen} onOpenChange={setIsRsvpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>RSVP List</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {viewingRsvps && viewingRsvps.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>RSVP Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewingRsvps.map((rsvp, index) => (
                    <TableRow key={index}>
                      <TableCell>{rsvp.user?.name || 'N/A'}</TableCell>
                      <TableCell>{rsvp.user?.email || 'N/A'}</TableCell>
                      <TableCell>{format(new Date(rsvp.rsvpDate), 'PPP p')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No RSVPs yet.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Workshops;
