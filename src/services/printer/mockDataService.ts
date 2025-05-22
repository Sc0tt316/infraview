
// This file is now completely deprecated because we're using a real SNMP-based API
// All functionality has been moved to the respective service files

export const initializePrinters = async (): Promise<void> => {
  console.warn('initializePrinters from mockDataService is deprecated and does nothing');
  return;
};

export const initializeLogs = async (): Promise<void> => {
  console.warn('initializeLogs from mockDataService is deprecated and does nothing');
  return;
};

export const initializeActivity = async (): Promise<void> => {
  console.warn('initializeActivity from mockDataService is deprecated and does nothing');
  return;
};
