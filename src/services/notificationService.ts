
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
      return stored ? JSON.parse(stored) : this.generateMockNotifications();
    } catch (error) {
      console.error('Error retrieving notifications:', error);
      return this.generateMockNotifications();
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
  
  private saveNotifications(notifications: Notification[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }
  
  private generateMockNotifications(): Notification[] {
    return [
      {
        id: uuidv4(),
        title: 'Low Toner Alert',
        message: 'Printer HP LaserJet 4200 is low on toner. Please replace soon.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        type: 'printer',
        resourceId: '1'
      },
      {
        id: uuidv4(),
        title: 'New User Added',
        message: 'User Sarah Johnson has been added to the system.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: false,
        type: 'user',
        resourceId: '3'
      },
      {
        id: uuidv4(),
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight at 11 PM.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        read: true,
        type: 'alert'
      },
      {
        id: uuidv4(),
        title: 'Print Job Error',
        message: 'Print job failed for document "Annual Report.pdf".',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read: true,
        type: 'printer',
        resourceId: '2'
      },
      {
        id: uuidv4(),
        title: 'Usage Report Available',
        message: 'Monthly printer usage report is now available.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
        type: 'analytics'
      }
    ];
  }
}

export const notificationService = new NotificationService();
