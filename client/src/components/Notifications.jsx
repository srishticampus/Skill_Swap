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
      {notifications.length === 0 ? (
        <DropdownMenuItem>No notifications yet.</DropdownMenuItem>
      ) : (
        <>
          {notifications.map(notification => (
            <React.Fragment key={notification._id}>
              <DropdownMenuItem>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <Badge variant={notification.status === 'approved' ? 'success' : notification.status === 'rejected' ? 'destructive' : 'secondary'}>{notification.status}</Badge>
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