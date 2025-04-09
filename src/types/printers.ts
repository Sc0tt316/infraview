
// Define printer types
export interface PrinterData {
  id: string;
  name: string;
  model: string;
  location: string;
  status: "online" | "offline" | "error" | "maintenance" | "warning";
  inkLevel: number;
  paperLevel: number;
  jobCount: number;
  lastActive: string;
  ipAddress?: string;
  department?: string;
  serialNumber?: string;
  addedDate?: string;
  supplies?: {
    black: number;
    cyan?: number;
    magenta?: number;
    yellow?: number;
    waste?: number;
  };
  stats?: {
    totalPages: number;
    monthlyPages: number;
    jams: number;
  };
}

// Define log types 
export interface PrinterLog {
  id: string;
  printerId: string;
  timestamp: string;
  message: string;
  type: "info" | "warning" | "error";
  user?: string;
}

// Define activity types
export interface PrinterActivity {
  id: string;
  printerId: string;
  timestamp: string;
  action: string;
  user?: string;
  details?: string;
}

// Adding missing types that were causing errors
export type PrintLog = {
  id: string;
  timestamp: string;
  fileName: string;
  pages: number;
  size: string;
  status: 'completed' | 'failed';
  user: string;
};

export type ActivityItem = {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  details?: string;
};
