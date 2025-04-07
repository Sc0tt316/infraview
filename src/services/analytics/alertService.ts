
import { apiService } from '../api';
import { toast } from 'sonner';
import { AlertData } from '@/types/analytics';
import { getTimeAgo } from './utils';

// Initialize alerts
const initializeAlerts = async () => {
  const existingData = await apiService.get<AlertData[]>('alerts');
  if (!existingData) {
    const alertTitles = {
      critical: [
        'Printer Offline',
        'Paper Jam',
        'Low Toner',
        'Hardware Failure',
        'Connection Lost'
      ],
      warning: [
        'Low Paper',
        'Toner Low (20%)',
        'Maintenance Required',
        'Print Queue Full',
        'Calibration Needed'
      ],
      info: [
        'Print Job Completed',
        'Firmware Update Available',
        'New Printer Detected',
        'Print Statistics Updated',
        'User Access Updated'
      ]
    };
    
    const alertDescriptions = {
      critical: [
        'The printer is not responding to connection attempts.',
        'Paper jam detected in tray 2. User intervention required.',
        'Black toner cartridge critically low (<5%). Replace immediately.',
        'Printer hardware error code #E543. Service required.',
        'Network connection to printer lost. Check network configuration.'
      ],
      warning: [
        'Paper level low in main tray. Please refill soon.',
        'Cyan toner level at 20%. Consider replacing soon.',
        'Printer maintenance recommended after 10,000 pages printed.',
        'Print queue has reached 80% capacity. Consider clearing old jobs.',
        'Color calibration needed for optimal print quality.'
      ],
      info: [
        'Large print job successfully completed (123 pages).',
        'New firmware version 4.2.1 is available for this printer.',
        'New printer has been automatically detected on the network.',
        'Monthly print statistics have been updated and are available.',
        'User permissions for printer access have been updated.'
      ]
    };
    
    const printerNames = [
      'HP LaserJet Pro M404n',
      'Xerox WorkCentre 6515',
      'Brother MFC-L8900CDW',
      'Canon PIXMA TR8520',
      'Epson WorkForce Pro WF-4740',
      'Kyocera ECOSYS P5026cdw',
      'Lexmark CX517de'
    ];
    
    const users = [
      { id: 'u1', name: 'Alex Johnson' },
      { id: 'u2', name: 'Sarah Miller' },
      { id: 'u3', name: 'Michael Chen' }
    ];
    
    const mockData: AlertData[] = [];
    
    Object.keys(alertTitles).forEach((level, levelIndex) => {
      const typedLevel = level as keyof typeof alertTitles;
      const titles = alertTitles[typedLevel];
      const descriptions = alertDescriptions[typedLevel];
      
      for (let i = 0; i < 10; i++) {
        const today = new Date();
        const daysAgo = Math.floor(Math.random() * (7 - levelIndex * 2));
        const hoursAgo = Math.floor(Math.random() * 24);
        const minutesAgo = Math.floor(Math.random() * 60);
        
        today.setDate(today.getDate() - daysAgo);
        today.setHours(today.getHours() - hoursAgo);
        today.setMinutes(today.getMinutes() - minutesAgo);
        
        const titleIndex = Math.floor(Math.random() * titles.length);
        const printerIndex = Math.floor(Math.random() * printerNames.length);
        const userIndex = Math.floor(Math.random() * users.length);
        
        const resolved = typedLevel === 'info' ? Math.random() > 0.3 : 
                         typedLevel === 'warning' ? Math.random() > 0.7 : 
                         Math.random() > 0.9;
        
        mockData.push({
          id: `alert-${mockData.length + 1}`,
          timestamp: today.toISOString(),
          level: typedLevel,
          title: titles[titleIndex],
          status: resolved ? 'resolved' : 'active',
          description: descriptions[titleIndex],
          message: descriptions[titleIndex],
          entityId: `printer-${printerIndex + 1}`,
          entityType: 'printer',
          entityName: printerNames[printerIndex],
          resolved,
          timeAgo: getTimeAgo(today),
          printer: {
            id: `printer-${printerIndex + 1}`,
            name: printerNames[printerIndex]
          },
          user: Math.random() > 0.5 ? {
            id: users[userIndex].id,
            name: users[userIndex].name
          } : undefined
        });
      }
    });
    
    mockData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    await apiService.post('alerts', mockData);
    return mockData;
  }
  return existingData;
};

// Alerts service
export const alertService = {
  getAlerts: async (options: { limit?: number, status?: 'all' | 'active' | 'resolved', level?: 'all' | 'critical' | 'warning' | 'info', sortBy?: string, sortOrder?: 'asc' | 'desc' } = {}): Promise<AlertData[]> => {
    try {
      const { limit = 100, status = 'all', level = 'all', sortBy = 'timestamp', sortOrder = 'desc' } = options;
      const alerts = await initializeAlerts();
      
      let filteredAlerts = [...alerts];
      
      if (status !== 'all') {
        filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
      }
      
      if (level !== 'all') {
        filteredAlerts = filteredAlerts.filter(alert => alert.level === level);
      }
      
      if (sortBy === 'timestamp') {
        filteredAlerts.sort((a, b) => {
          const comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          return sortOrder === 'desc' ? -comparison : comparison;
        });
      } else if (sortBy === 'level') {
        const levelValues = { critical: 3, warning: 2, info: 1 };
        filteredAlerts.sort((a, b) => {
          // @ts-ignore
          const comparison = levelValues[a.level] - levelValues[b.level];
          return sortOrder === 'desc' ? -comparison : comparison;
        });
      } else if (sortBy in alerts[0]) {
        filteredAlerts.sort((a, b) => {
          // @ts-ignore
          const comparison = a[sortBy] > b[sortBy] ? 1 : -1;
          return sortOrder === 'desc' ? -comparison : comparison;
        });
      }
      
      return filteredAlerts.slice(0, limit);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error("Failed to fetch alerts. Please try again.");
      return [];
    }
  },
  
  resolveAlert: async (alertId: string): Promise<boolean> => {
    try {
      const allAlerts = await initializeAlerts();
      const alertIndex = allAlerts.findIndex(alert => alert.id === alertId);
      
      if (alertIndex === -1) {
        toast.error("Alert not found");
        return false;
      }
      
      allAlerts[alertIndex].resolved = true;
      allAlerts[alertIndex].status = 'resolved';
      
      await apiService.post('alerts', allAlerts);
      
      toast.success("Alert resolved successfully");
      return true;
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error("Failed to resolve alert. Please try again.");
      return false;
    }
  }
};
