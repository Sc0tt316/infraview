import { apiService } from '../api';
import { PrinterData, PrintLog, PrinterActivity } from '@/types/printers';

// This file is now deprecated because we're using Supabase
// Keeping minimal implementation for backward compatibility

// Initialize printers (no-op - using Supabase now)
export const initializePrinters = async (): Promise<void> => {
  // No need to initialize mock data anymore
  return;
};

// Initialize logs (no-op - using Supabase now)
export const initializeLogs = async (): Promise<void> => {
  // No need to initialize mock data anymore
  return;
};

// Initialize activity (no-op - using Supabase now)
export const initializeActivity = async (): Promise<void> => {
  // No need to initialize mock data anymore
  return;
};
