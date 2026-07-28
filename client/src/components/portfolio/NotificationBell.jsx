import React, { useState, useEffect } from "react";
import { Bell, Check, X, Mail, Calendar, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { localAPI } from "@/api/localClient";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await localAPI.admin.getAdminData();
      const messages = response?.messages || [];
      const meetings = response?.meetings || [];
      
      // Create notifications from unread messages
      const messageNotifications = messages
        .filter(msg => msg.status === 'new')
        .map(msg => ({
          id: `msg-${msg.id}`,
          type: 'message',
          title: 'New Message',
          description: `From: ${msg.fullName || 'Unknown'}`,
          content: msg.message?.substring(0, 100) + (msg.message?.length > 100 ? '...' : ''),
          timestamp: new Date(msg.created_at).getTime(),
          data: msg,
          read: false
        }));

      // Create notifications from pending meetings
      const meetingNotifications = meetings
        .filter(meeting => meeting.status === 'pending')
        .map(meeting => ({
          id: `mtg-${meeting.id}`,
          type: 'meeting',
          title: 'Meeting Request',
          description: `Topic: ${meeting.meeting_topic || 'General Discussion'}`,
          content: `From: ${meeting.customer_name || 'Unknown'} - ${meeting.requested_date} at ${meeting.requested_time}`,
          timestamp: new Date(meeting.created_at).getTime(),
          data: meeting,
          read: false
        }));

      const allNotifications = [...messageNotifications, ...meetingNotifications]
        .sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.length);
      
      // Show toast for new notifications (if not open)
      if (allNotifications.length > 0 && !isOpen) {
        const latest = allNotifications[0];
        toast({
          title: `📬 ${latest.title}`,
          description: latest.description,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const markAsRead = async (notificationId, markAll = false) => {
    try {
      setIsLoading(true);
      
      if (markAll) {
        // Mark all notifications as read
        const updatedNotifications = notifications.map(notif => ({
          ...notif,
          read: true
        }));
        setNotifications(updatedNotifications);
        setUnreadCount(0);
        
        // Update backend status for messages and meetings
        for (const notif of notifications) {
          if (notif.type === 'message' && !notif.read) {
            await localAPI.contact.update(notif.data.id, { status: 'read' });
          }
        }
      } else {
        // Mark single notification as read
        const notification = notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
          const updatedNotifications = notifications.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          );
          setNotifications(updatedNotifications);
          setUnreadCount(prev => Math.max(0, prev - 1));
          
          // Update backend status
          if (notification.type === 'message') {
            await localAPI.contact.update(notification.data.id, { status: 'read' });
          }
        }
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to update notification status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <Mail className="w-4 h-4 text-blue-500" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-96 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <h3 className="font-heading font-bold text-sm text-foreground">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAsRead(null, true)}
                      disabled={isLoading}
                      className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted transition-colors"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        'Mark all read'
                      )}
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-muted-foreground hover:text-destructive px-2 py-1 rounded hover:bg-muted transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No notifications</p>
                  <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-card transition-colors ${notification.read ? 'opacity-75' : 'bg-primary/5'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-medium text-sm text-foreground">
                                {notification.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {notification.description}
                              </p>
                              {notification.content && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {notification.content}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => clearNotification(notification.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                              aria-label="Dismiss notification"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-muted-foreground">
                              {formatTime(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                disabled={isLoading}
                                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                              >
                                <Check className="w-3 h-3" />
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-border bg-card text-center">
                <button
                  onClick={() => window.location.href = '/admin'}
                  className="text-xs text-primary hover:text-primary/80 font-medium"
                >
                  View all in dashboard →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}