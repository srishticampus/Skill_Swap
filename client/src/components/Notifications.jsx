import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

const Notifications = ({ onNotificationRead }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/api/notifications');
        console.log(response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axiosInstance.put(`/api/notifications/${notificationId}/read`);
      // Update the notification in the state
      if(!notifications) return;
      if(!notifications.length) return;
      setNotifications(notifications.map(notification =>
        notification._id === notificationId ? { ...notification, read: true } : notification
      ));
      if (onNotificationRead) {
        onNotificationRead();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <>
      {!notifications || notifications.length === 0 ? (
        <DropdownMenuItem>No notifications yet.</DropdownMenuItem>
      ) : (
        <>
          {notifications?.map(notification => (
            <React.Fragment key={notification._id}>
              <DropdownMenuItem>
                <div className="flex flex-col justify-between items-start">
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <Badge variant={
                      notification.type === 'New Workshop' ? 'default' :
                      notification.type === 'Workshop RSVP' ? 'secondary' : // Using secondary as 'info' might not exist
                      notification.status === 'approved' ? 'success' :
                      notification.status === 'rejected' ? 'destructive' :
                      'secondary'
                    }>
                      {notification.type === 'New Workshop' ? 'New' :
                       notification.type === 'Workshop RSVP' ? 'RSVP' :
                       notification.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(notification._id)} disabled={notification.read}>
                    {notification.read ? 'Read' : 'Mark as Read'}
                  </Button>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
};

export default Notifications;
