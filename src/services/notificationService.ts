
import { v4 as uuidv4 } from 'uuid';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type?: string; // 'printer', 'user', 'alert', 'analytics'
  resourceId?: string; // ID of the related resource
}

class NotificationService {
  private readonly STORAGE_KEY = 'app_notifications';
  private readonly MAX_NOTIFICATIONS = 50; // Limit total notifications
  private notificationThrottles: Record<string, number> = {}; // Track notification timestamps by type
  private readonly THROTTLE_TIME = 60000; // 1 minute between similar notifications
  
  getNotifications(): Notification[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving notifications:', error);
      return [];
    }
  }
  
  getUnreadCount(): number {
    const notifications = this.getNotifications();
    return notifications.filter(n => !n.read).length;
  }
  
  addNotification(title: string, message: string, type?: string, resourceId?: string): Notification | null {
    // Create a throttle key based on type and resourceId if available
    const throttleKey = `${type || 'general'}_${resourceId || 'none'}`;
    const now = Date.now();
    
    // Check if this type of notification has been sent recently
    if (this.notificationThrottles[throttleKey] && 
        now - this.notificationThrottles[throttleKey] < this.THROTTLE_TIME) {
      console.log(`Notification throttled: ${title}`);
      return null; // Skip creating the notification
    }
    
    try {
      const notifications = this.getNotifications();
      
      // Check for duplicate notifications with same title and message in the last minute
      const recentDuplicate = notifications.find(n => 
        n.title === title && 
        n.message === message && 
        (new Date().getTime() - new Date(n.timestamp).getTime()) < this.THROTTLE_TIME
      );
      
      if (recentDuplicate) {
        console.log(`Duplicate notification suppressed: ${title}`);
        return null;
      }
      
      const newNotification: Notification = {
        id: uuidv4(),
        title,
        message,
        timestamp: new Date(),
        read: false,
        type,
        resourceId
      };
      
      // Add to throttle tracker
      this.notificationThrottles[throttleKey] = now;
      
      // Limit total notifications by removing oldest if needed
      let updatedNotifications = [newNotification, ...notifications];
      if (updatedNotifications.length > this.MAX_NOTIFICATIONS) {
        updatedNotifications = updatedNotifications.slice(0, this.MAX_NOTIFICATIONS);
      }
      
      this.saveNotifications(updatedNotifications);
      
      return newNotification;
    } catch (error) {
      console.error('Error adding notification:', error);
      return null;
    }
  }
  
  markAsRead(id: string): void {
    const notifications = this.getNotifications();
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    this.saveNotifications(updatedNotifications);
  }
  
  markAllAsRead(): void {
    const notifications = this.getNotifications();
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    
    this.saveNotifications(updatedNotifications);
  }
  
  deleteNotification(id: string): void {
    const notifications = this.getNotifications();
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    
    this.saveNotifications(updatedNotifications);
  }
  
  clearAllNotifications(): void {
    this.saveNotifications([]);
  }
  
  private saveNotifications(notifications: Notification[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }
}

export const notificationService = new NotificationService();
