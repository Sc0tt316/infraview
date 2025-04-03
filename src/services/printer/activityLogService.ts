
import { apiService } from '../api';
import { toast } from '@/hooks/use-toast';
import { PrinterLog, PrinterActivity } from '@/types/printers';
import { initializeLogs, initializeActivity } from './mockDataService';

// Get printer logs
export const getPrinterLogs = async (printerId: string): Promise<PrinterLog[]> => {
  try {
    await initializeLogs();
    const logs = await apiService.get<PrinterLog[]>('printerLogs');
    return logs?.filter(log => log.printerId === printerId) || [];
  } catch (error) {
    console.error(`Error fetching logs for printer ${printerId}:`, error);
    toast({
      title: "Error",
      description: "Failed to fetch printer logs. Please try again.",
      variant: "destructive"
    });
    return [];
  }
};

// Add a new log
export const addLog = async (logData: Omit<PrinterLog, 'id'>): Promise<PrinterLog> => {
  try {
    await initializeLogs();
    const logs = await apiService.get<PrinterLog[]>('printerLogs') || [];
    
    const newLog: PrinterLog = {
      ...logData,
      id: `l${Date.now()}`
    };
    
    const updatedLogs = [...logs, newLog];
    await apiService.post('printerLogs', updatedLogs);
    
    return newLog;
  } catch (error) {
    console.error('Error adding log:', error);
    return {
      id: `l${Date.now()}`,
      ...logData
    };
  }
};

// Get printer activity
export const getPrinterActivity = async (printerId: string): Promise<PrinterActivity[]> => {
  try {
    await initializeActivity();
    const activities = await apiService.get<PrinterActivity[]>('printerActivity');
    return activities?.filter(activity => activity.printerId === printerId) || [];
  } catch (error) {
    console.error(`Error fetching activity for printer ${printerId}:`, error);
    toast({
      title: "Error",
      description: "Failed to fetch printer activity. Please try again.",
      variant: "destructive"
    });
    return [];
  }
};

// Add a new activity
export const addActivity = async (activityData: Omit<PrinterActivity, 'id'>): Promise<PrinterActivity> => {
  try {
    await initializeActivity();
    const activities = await apiService.get<PrinterActivity[]>('printerActivity') || [];
    
    const newActivity: PrinterActivity = {
      ...activityData,
      id: `a${Date.now()}`
    };
    
    const updatedActivities = [...activities, newActivity];
    await apiService.post('printerActivity', updatedActivities);
    
    return newActivity;
  } catch (error) {
    console.error('Error adding activity:', error);
    return {
      id: `a${Date.now()}`,
      ...activityData
    };
  }
};

// Get all logs (for activity page)
export const getAllLogs = async (): Promise<PrinterLog[]> => {
  try {
    await initializeLogs();
    const logs = await apiService.get<PrinterLog[]>('printerLogs');
    return logs || [];
  } catch (error) {
    console.error('Error fetching all logs:', error);
    toast({
      title: "Error",
      description: "Failed to fetch logs. Please try again.",
      variant: "destructive"
    });
    return [];
  }
};

// Get all activities (for activity page)
export const getAllActivities = async (): Promise<PrinterActivity[]> => {
  try {
    await initializeActivity();
    const activities = await apiService.get<PrinterActivity[]>('printerActivity');
    return activities || [];
  } catch (error) {
    console.error('Error fetching all activities:', error);
    toast({
      title: "Error",
      description: "Failed to fetch activities. Please try again.",
      variant: "destructive"
    });
    return [];
  }
};
