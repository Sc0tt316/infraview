
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
  printLogs?: PrintLog[];
  activity?: ActivityItem[];
}

// Define print log type
export interface PrintLog {
  id?: string;
  fileName: string;
  user: string;
  timestamp: string;
  status: "completed" | "failed";
  pages: number;
  size: string;
}

// Define activity item type
export interface ActivityItem {
  id?: string;
  timestamp: string;
  type: "error" | "warning" | "info" | "success";
  message: string;
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
