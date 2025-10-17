import { useState, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

/**
 * Custom hook for managing notifications with WebSocket support
 */
export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);

  // Fetch initial notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:9191/api/notifications', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:9191/api/notifications/unread/count', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // Connect to WebSocket
  useEffect(() => {
    const socket = new SockJS('http://localhost:9191/ws-notifications');
    const client = Stomp.over(socket);

    // Disable console logs from STOMP
    client.debug = () => {};

    client.connect(
      {},
      () => {
        console.log('✅ WebSocket connected');
        setConnected(true);
        setStompClient(client);

        // Subscribe to user-specific notifications
        // Note: Username should be retrieved from auth context
        // For now, we'll subscribe to a general topic
        client.subscribe('/user/queue/notifications', (message) => {
          const notification = JSON.parse(message.body);
          console.log('📧 New notification received:', notification);

          // Add new notification to the list
          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // Show browser notification if permission granted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('DocuFlow Notification', {
              body: notification.message,
              icon: '/favicon.ico',
              badge: '/favicon.ico'
            });
          }
        });
      },
      (error) => {
        console.error('❌ WebSocket connection error:', error);
        setConnected(false);
      }
    );

    return () => {
      if (client && client.connected) {
        client.disconnect();
        console.log('🔌 WebSocket disconnected');
      }
    };
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Poll for updates every 30 seconds as fallback
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications, fetchUnreadCount]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:9191/api/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          credentials: 'include'
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(
        'http://localhost:9191/api/notifications/mark-all-read',
        {
          method: 'PUT',
          credentials: 'include'
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:9191/api/notifications/${notificationId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      if (response.ok) {
        setNotifications((prev) => {
          const notification = prev.find((n) => n.id === notificationId);
          if (notification && !notification.isRead) {
            setUnreadCount((count) => Math.max(0, count - 1));
          }
          return prev.filter((n) => n.id !== notificationId);
        });
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    try {
      const response = await fetch(
        'http://localhost:9191/api/notifications/clear-all',
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      if (response.ok) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    connected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    refreshNotifications: fetchNotifications
  };
}