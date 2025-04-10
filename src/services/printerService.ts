
// This file is kept for backward compatibility
// Import from the new modular structure and re-export
import { printerService } from './printer';
import type { PrinterData, PrintLog, PrinterActivity } from '@/types/printers';

// Re-export everything
export { printerService };
export type { PrinterData, PrintLog, PrinterActivity };
