
import { PrinterData } from '@/types/printers';
import { updatePrinter } from './updatePrinter';
import { addLog } from '../activityLogService';

// Change printer status
export const changeStatus = async (id: string, status: PrinterData['status']): Promise<PrinterData | null> => {
  const result = await updatePrinter(id, { status });
  
  if (result) {
    // Add log record
    await addLog({
      printerId: id,
      timestamp: new Date().toISOString(),
      message: `Status changed to ${status}`,
      type: status === 'error' ? 'error' : 'info',
      user: 'admin'
    });
  }
  
  return result;
};
