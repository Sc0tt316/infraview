
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
  
  addNotification(title: string, message: string, type?: string, resourceId?: string): Notification {
    const notifications = this.getNotifications();
    
    const newNotification: Notification = {
      id: uuidv4(),
      title,
      message,
      timestamp: new Date(),
      read: false,
      type,
      resourceId
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    this.saveNotifications(updatedNotifications);
    
    return newNotification;
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
