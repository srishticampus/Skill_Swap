import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from '@/api/axios';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const MemberWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const { user } = useAuth(); // Get user from AuthContext

  useEffect(() => {
    fetchWorkshopsForMembers();
  }, [user]); // Re-fetch when user changes (e.g., after login)

  const fetchWorkshopsForMembers = async () => {
    try {
      const response = await axios.get('/api/organization/workshops/members');
      setWorkshops(response.data);
    } catch (error) {
      console.error('Error fetching member workshops:', error);
      toast.error('Failed to fetch workshops.');
    }
  };

  const handleRsvp = async (workshopId) => {
    try {
      // Optimistic update
      setWorkshops(prevWorkshops =>
        prevWorkshops.map(workshop =>
          workshop._id === workshopId
            ? { ...workshop, rsvpList: [...workshop.rsvpList, { user: user.id, rsvpDate: new Date() }] }
            : workshop
        )
      );

      await axios.post(`/api/organization/workshops/${workshopId}/rsvp`);
      toast.success('Successfully RSVPd to the workshop!');
      fetchWorkshopsForMembers(); // Re-fetch to ensure full data consistency
    } catch (error) {
      console.error('Error RSVPing to workshop:', error);
      toast.error(error.response?.data?.msg || 'Failed to RSVP to workshop.');
      fetchWorkshopsForMembers(); // Re-fetch to revert to actual state if API call fails
    }
  };

  const handleCancelRsvp = async (workshopId) => {
    try {
      // Optimistic update
      setWorkshops(prevWorkshops =>
        prevWorkshops.map(workshop =>
          workshop._id === workshopId
            ? { ...workshop, rsvpList: workshop.rsvpList.filter(rsvp => rsvp.user.toString() !== user.id) }
            : workshop
        )
      );

      await axios.delete(`/api/organization/workshops/${workshopId}/rsvp`);
      toast.success('Successfully cancelled RSVP!');
      fetchWorkshopsForMembers(); // Re-fetch to ensure full data consistency
    } catch (error) {
      console.error('Error cancelling RSVP:', error);
      toast.error(error.response?.data?.msg || 'Failed to cancel RSVP.');
      fetchWorkshopsForMembers(); // Re-fetch to revert to actual state if API call fails
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Workshops</CardTitle>
          <CardDescription>View and RSVP to workshops organized by your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          {workshops.length === 0 ? (
            <p>No upcoming workshops available from your organization.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workshops.map((workshop) => (
                <Card key={workshop._id}>
                  <CardHeader>
                    <CardTitle>{workshop.title}</CardTitle>
                    <CardDescription>{workshop.organization?.name || 'N/A'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{workshop.description}</p>
                    <p className="text-sm"><strong>Date:</strong> {format(new Date(workshop.date), 'PPP')}</p>
                    <p className="text-sm"><strong>Time:</strong> {workshop.time}</p>
                    <p className="text-sm"><strong>Location:</strong> {workshop.location}</p>
                    <p className="text-sm">
                      <strong>Attendees:</strong> {workshop.rsvpList.length}
                      {workshop.maxAttendees && ` / ${workshop.maxAttendees}`}
                    </p>
                    {(() => {
                      const workshopDateTime = new Date(`${format(new Date(workshop.date), 'yyyy-MM-dd')}T${workshop.time}:00`);
                      const now = new Date();
                      let statusText = '';
                      let isPast = false;

                      if (workshopDateTime < now) {
                        statusText = 'Ended';
                        isPast = true;
                      } else {
                        statusText = 'Upcoming';
                      }

                      const isUserRSVPd = workshop.rsvpList.some(rsvp => user && rsvp.user.toString() === user.id);
                      const isWorkshopFull = workshop.maxAttendees && workshop.rsvpList.length >= workshop.maxAttendees;

                      return (
                        <>
                          <p className="text-sm mt-2"><strong>Status:</strong> {statusText}</p>
                          <div className="mt-4">
                            {isUserRSVPd ? (
                              <>
                                <Button disabled>RSVP Done</Button>
                                <Button variant="outline" onClick={() => handleCancelRsvp(workshop._id)} className="ml-2" disabled={isPast}>Cancel RSVP</Button>
                              </>
                            ) : (
                              <Button onClick={() => handleRsvp(workshop._id)} disabled={isWorkshopFull || isPast}>
                                {isWorkshopFull ? 'Full' : (isPast ? 'Ended' : 'RSVP')}
                              </Button>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberWorkshops;
