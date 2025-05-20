
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PrintLog, PrinterActivity } from '@/types/printers';

// Get printer logs
export const getPrinterLogs = async (printerId: string): Promise<PrintLog[]> => {
  try {
    const { data, error } = await supabase
      .from('printer_logs')
      .select('*')
      .eq('printer_id', printerId)
      .order('timestamp', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Convert to our PrintLog format
    return data.map(log => ({
      id: log.id,
      printerId: log.printer_id,
      fileName: log.file_name,
      status: log.status as 'completed' | 'failed' | 'pending',
      timestamp: log.timestamp,
      pages: log.pages,
      size: log.size,
      user: log.user_id
    }));
  } catch (error) {
    console.error(`Error fetching logs for printer ${printerId}:`, error);
    useToast().toast({
      title: "Error",
      description: "Failed to fetch printer logs. Please try again.",
      variant: "destructive"
    });
    return [];
  }
};

// Add a new log
export const addLog = async (logData: Omit<PrintLog, 'id'>): Promise<PrintLog> => {
  try {
    const dbLogData = {
      printer_id: logData.printerId,
      file_name: logData.fileName,
      status: logData.status,
      timestamp: logData.timestamp,
      pages: logData.pages,
      size: logData.size,
      user_id: logData.user
    };
    
    const { data: newLog, error } = await supabase
      .from('printer_logs')
      .insert(dbLogData)
      .select('*')
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: newLog.id,
      printerId: newLog.printer_id,
      fileName: newLog.file_name,
      status: newLog.status as 'completed' | 'failed' | 'pending',
      timestamp: newLog.timestamp,
      pages: newLog.pages,
      size: newLog.size,
      user: newLog.user_id
    };
  } catch (error) {
    console.error('Error adding log:', error);
    throw error;
  }
};

// Get printer activity
export const getPrinterActivity = async (printerId: string): Promise<PrinterActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('printer_activities')
      .select('*')
      .eq('printer_id', printerId)
      .order('timestamp', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Convert to our PrinterActivity format
    return data.map(activity => ({
      id: activity.id,
      printerId: activity.printer_id,
      printerName: activity.printer_name,
      action: activity.action,
      timestamp: activity.timestamp,
      user: activity.user_id,
      details: activity.details,
      status: activity.status as 'success' | 'warning' | 'error' | 'info'
    }));
  } catch (error) {
    console.error(`Error fetching activity for printer ${printerId}:`, error);
    useToast().toast({
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
    const dbActivityData = {
      printer_id: activityData.printerId,
      printer_name: activityData.printerName,
      action: activityData.action,
      timestamp: activityData.timestamp,
      user_id: activityData.user,
      details: activityData.details,
      status: activityData.status
    };
    
    const { data: newActivity, error } = await supabase
      .from('printer_activities')
      .insert(dbActivityData)
      .select('*')
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: newActivity.id,
      printerId: newActivity.printer_id,
      printerName: newActivity.printer_name,
      action: newActivity.action,
      timestamp: newActivity.timestamp,
      user: newActivity.user_id,
      details: newActivity.details,
      status: newActivity.status as 'success' | 'warning' | 'error' | 'info'
    };
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
};

// Get all logs (for activity page)
export const getAllLogs = async (): Promise<PrintLog[]> => {
  try {
    const { data, error } = await supabase
      .from('printer_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Convert to our PrintLog format
    return data.map(log => ({
      id: log.id,
      printerId: log.printer_id,
      fileName: log.file_name,
      status: log.status as 'completed' | 'failed' | 'pending',
      timestamp: log.timestamp,
      pages: log.pages,
      size: log.size,
      user: log.user_id
    }));
  } catch (error) {
    console.error('Error fetching all logs:', error);
    useToast().toast({
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
    const { data, error } = await supabase
      .from('printer_activities')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Convert to our PrinterActivity format
    return data.map(activity => ({
      id: activity.id,
      printerId: activity.printer_id,
      printerName: activity.printer_name,
      action: activity.action,
      timestamp: activity.timestamp,
      user: activity.user_id,
      details: activity.details,
      status: activity.status as 'success' | 'warning' | 'error' | 'info'
    }));
  } catch (error) {
    console.error('Error fetching all activities:', error);
    useToast().toast({
      title: "Error",
      description: "Failed to fetch activities. Please try again.",
      variant: "destructive"
    });
    return [];
  }
};
