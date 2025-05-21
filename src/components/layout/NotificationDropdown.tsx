
import React, { useState, useEffect } from "react";
import { Bell, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notificationService, Notification } from "@/services/notificationService";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch notifications on mount and when dropdown opens
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // In a real implementation, this would fetch from Supabase
        // For now, we'll use the notification service
        const allNotifications = notificationService.getNotifications();
        setNotifications(allNotifications);
        setUnreadCount(notificationService.getUnreadCount());
        
        // Listen for real-time notifications
        const channel = supabase
          .channel('public:alerts')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'alerts' },
            (payload) => {
              // When we receive a new alert, create a notification for it
              if (payload.eventType === 'INSERT') {
                const newAlert = payload.new;
                
                const notification: Notification = {
                  id: newAlert.id,
                  title: newAlert.title,
                  message: newAlert.description,
                  timestamp: newAlert.created_at || new Date().toISOString(),
                  read: false,
                  type: 'alert',
                  resourceId: newAlert.id
                };
                
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
                
                // Show toast for new alerts
                toast({
                  title: "New Alert",
                  description: newAlert.title
                });
              }
            }
          )
          .subscribe();
          
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    
    if (open) {
      // Mark all as read when dropdown is opened
      const timer = setTimeout(() => {
        notificationService.markAllAsRead();
        fetchNotifications();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleReadNotification = (id: string, type?: string, resourceId?: string) => {
    notificationService.markAsRead(id);
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Navigate to appropriate page based on notification type
    if (type) {
      try {
        switch(type) {
          case "printer":
            navigate(resourceId ? `/printers/${resourceId}` : '/printers');
            break;
          case "user":
            navigate('/users');
            break;
          case "alert":
            navigate('/alerts');
            break;
          case "analytics":
            navigate('/analytics');
            break;
          default:
            // Default to dashboard if type is unknown
            navigate('/');
        }
        
        toast({
          title: "Success",
          description: `Navigating to ${type} page`
        });
        setOpen(false);
      } catch (error) {
        console.error("Navigation error:", error);
        toast({
          title: "Error",
          description: "Failed to navigate to the requested page"
        });
      }
    }
  };
  
  const handleClearAllNotifications = () => {
    notificationService.clearAllNotifications();
    setNotifications([]);
    setUnreadCount(0);
    toast({
      title: "Success",
      description: "All notifications have been cleared"
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} className="text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center justify-between">
            <span className="font-bold">Notifications</span>
            <div className="flex space-x-2">
              {notifications.length > 0 && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-blue-500"
                    onClick={() => {
                      notificationService.markAllAsRead();
                      setNotifications(prev => 
                        prev.map(notification => ({ ...notification, read: true }))
                      );
                      setUnreadCount(0);
                    }}
                  >
                    Mark all as read
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-red-500 flex items-center"
                    onClick={handleClearAllNotifications}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear all
                  </Button>
                </>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="px-2 py-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={`px-4 py-3 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
                onClick={() => handleReadNotification(notification.id, notification.type, notification.resourceId)}
              >
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
