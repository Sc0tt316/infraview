
import { Alert } from '@/types/alerts';

// Get alert metrics
export const alertService = {
  getAlertMetrics: async (): Promise<{ total: number; active: number; critical: number }> => {
    // Normally would fetch from API
    return {
      total: 8,
      active: 5,
      critical: 2
    };
  },
  
  getAlerts: async (options?: { 
    limit?: number; 
    status?: 'all' | 'active' | 'resolved'; 
    level?: 'all' | 'critical' | 'high' | 'medium' | 'low';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Alert[]> => {
    // This would normally fetch from an API
    const mockAlerts: Alert[] = [
      {
        id: "alert1",
        title: "Printer offline",
        description: "Marketing printer is offline and not responding",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        severity: "medium",
        isResolved: false,
        printer: {
          id: "printer1",
          name: "Marketing Printer",
          location: "2nd Floor"
        }
      },
      {
        id: "alert2",
        title: "Toner low",
        description: "Finance printer toner level below 10%",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        severity: "low",
        isResolved: false,
        printer: {
          id: "printer2",
          name: "Finance Printer",
          location: "1st Floor"
        }
      },
      {
        id: "alert3",
        title: "Paper jam",
        description: "Executive printer has a paper jam in tray 2",
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        severity: "high",
        isResolved: false,
        printer: {
          id: "printer3",
          name: "Executive Printer",
          location: "3rd Floor"
        }
      }
    ];
    
    return mockAlerts.slice(0, options?.limit || mockAlerts.length);
  }
};
