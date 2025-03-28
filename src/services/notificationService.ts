
// Notification interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: number;
}

// Simulated notifications service
const NOTIFICATION_KEY = 'notifications';

export const notificationService = {
  // Get all notifications
  getNotifications: (): Notification[] => {
    const notifications = localStorage.getItem(NOTIFICATION_KEY);
    return notifications ? JSON.parse(notifications) : [];
  },

  // Add a new notification
  addNotification: (title: string, message: string): Notification => {
    const notifications = notificationService.getNotifications();
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      read: false,
      timestamp: Date.now()
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updatedNotifications));
    
    return newNotification;
  },

  // Mark a notification as read
  markAsRead: (id: string): void => {
    const notifications = notificationService.getNotifications();
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updatedNotifications));
  },

  // Mark all notifications as read
  markAllAsRead: (): void => {
    const notifications = notificationService.getNotifications();
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updatedNotifications));
  },

  // Delete a notification
  deleteNotification: (id: string): void => {
    const notifications = notificationService.getNotifications();
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updatedNotifications));
  },

  // Get unread notification count
  getUnreadCount: (): number => {
    const notifications = notificationService.getNotifications();
    return notifications.filter(notification => !notification.read).length;
  }
};

// Add some initial notifications if none exist
const initializeNotifications = () => {
  const notifications = notificationService.getNotifications();
  if (notifications.length === 0) {
    notificationService.addNotification("Welcome to PrinterVerse", "Thanks for joining our printer management system.");
    notificationService.addNotification("Getting Started", "Check out the dashboard for an overview of your printers.");
  }
};

// Initialize notifications
initializeNotifications();
