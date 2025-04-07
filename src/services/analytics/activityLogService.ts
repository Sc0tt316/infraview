
import { apiService } from '../api';
import { toast } from 'sonner';
import { ActivityLogData } from '@/types/analytics';

// Initialize activity logs
const initializeActivityLogs = async () => {
  const existingData = await apiService.get<ActivityLogData[]>('activityLogs');
  if (!existingData) {
    const eventTypes = ['login', 'print', 'settings_change', 'printer_added', 'printer_removed', 'printer_status', 'user_added', 'user_removed'];
    const entityTypes = ['user', 'printer', 'system', 'document'];
    const users = [
      { id: 'u1', name: 'Alex Johnson' },
      { id: 'u2', name: 'Sarah Miller' },
      { id: 'u3', name: 'Michael Chen' },
      { id: 'u4', name: 'Emily Rodriguez' },
      { id: 'u5', name: 'James Wilson' }
    ];
    const typeToDescriptionMap: Record<string, string[]> = {
      'login': ['Logged in to the system', 'Successfully authenticated', 'New session started'],
      'print': ['Printed document', 'Completed print job', 'Sent document to printer'],
      'settings_change': ['Updated printer settings', 'Modified system configuration', 'Changed user preferences'],
      'printer_added': ['Added new printer to the system', 'Configured new printer device', 'Installed printer driver'],
      'printer_removed': ['Removed printer from system', 'Uninstalled printer', 'Deleted printer configuration'],
      'printer_status': ['Printer status changed', 'Printer went offline', 'Printer error reported', 'Printer maintenance required'],
      'user_added': ['Added new user account', 'Created user profile', 'Set up new user access'],
      'user_removed': ['Removed user account', 'Deleted user profile', 'Disabled user access']
    };
    
    const mockData: ActivityLogData[] = Array.from({ length: 50 }, (_, i) => {
      const today = new Date();
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const randomHours = Math.floor(Math.random() * 24);
      const randomMinutes = Math.floor(Math.random() * 60);
      today.setDate(today.getDate() - randomDaysAgo);
      today.setHours(today.getHours() - randomHours);
      today.setMinutes(today.getMinutes() - randomMinutes);
      
      const user = users[Math.floor(Math.random() * users.length)];
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
      
      let entityName = '';
      if (entityType === 'printer') {
        const printerNames = ['HP LaserJet 4100', 'Xerox WorkCentre', 'Epson EcoTank', 'Brother MFC-L8900CDW', 'Canon PIXMA Pro'];
        entityName = printerNames[Math.floor(Math.random() * printerNames.length)];
      } else if (entityType === 'document') {
        const docNames = ['Quarterly Report.pdf', 'Meeting Minutes.docx', 'Invoice-123.pdf', 'Project Proposal.pptx', 'Budget 2023.xlsx'];
        entityName = docNames[Math.floor(Math.random() * docNames.length)];
      } else if (entityType === 'user') {
        entityName = users[Math.floor(Math.random() * users.length)].name;
      } else {
        entityName = 'System Configuration';
      }
      
      const possibleDescriptions = typeToDescriptionMap[eventType] || ['Action performed'];
      const description = possibleDescriptions[Math.floor(Math.random() * possibleDescriptions.length)];
      
      let type: "success" | "error" | "info" | "warning" = "info";
      if (eventType.includes('error') || eventType === 'printer_removed' || eventType === 'user_removed') {
        type = Math.random() > 0.7 ? "error" : "warning";
      } else if (eventType === 'login' || eventType === 'print') {
        type = "success";
      }
      
      return {
        id: `act-${i + 1}`,
        timestamp: today.toISOString(),
        user: user.name,
        action: eventType,
        entityType,
        entityId: `ent-${Math.floor(Math.random() * 1000) + 1}`,
        type,
        message: description,
        userId: user.id,
        userName: user.name,
        description
      };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    await apiService.post('activityLogs', mockData);
    return mockData;
  }
  return existingData;
};

// Activity logs service
export const activityLogService = {
  getActivityLogs: async (options: { limit?: number, sortBy?: string, sortOrder?: 'asc' | 'desc' } = {}): Promise<ActivityLogData[]> => {
    try {
      const { limit = 100, sortBy = 'timestamp', sortOrder = 'desc' } = options;
      const logs = await initializeActivityLogs();
      
      let sortedLogs = [...logs];
      if (sortBy === 'timestamp') {
        sortedLogs.sort((a, b) => {
          const comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          return sortOrder === 'desc' ? -comparison : comparison;
        });
      } else if (sortBy in logs[0]) {
        sortedLogs.sort((a, b) => {
          // @ts-ignore
          const comparison = a[sortBy] > b[sortBy] ? 1 : -1;
          return sortOrder === 'desc' ? -comparison : comparison;
        });
      }
      
      return sortedLogs.slice(0, limit);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast.error("Failed to fetch activity logs. Please try again.");
      return [];
    }
  }
};
