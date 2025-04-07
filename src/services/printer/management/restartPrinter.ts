
import { addLog, addActivity } from '../activityLogService';

// Restart printer
export const restartPrinter = async (id: string): Promise<boolean> => {
  try {
    // In a real application, this would communicate with the printer
    // For demo purposes, we'll just update the status and return success
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
    
    // Add log record
    await addLog({
      printerId: id,
      timestamp: new Date().toISOString(),
      message: "Printer restarted",
      type: "info",
      user: "admin"
    });
    
    // Add activity record
    await addActivity({
      printerId: id,
      timestamp: new Date().toISOString(),
      action: "Printer restarted",
      user: "admin"
    });
    
    return true;
  } catch (error) {
    console.error(`Error restarting printer ${id}:`, error);
    throw error;
  }
};
