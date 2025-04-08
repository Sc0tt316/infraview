
export interface PrinterData {
  id: string;
  name: string;
  model: string;
  location: string;
  status: "online" | "offline" | "error" | "maintenance" | "warning";
  inkLevel: number;
  paperLevel: number;
  ipAddress: string;
  department: string;
  jobCount?: number;
  lastActive?: string;
  serialNumber?: string;
  addedDate?: string;
  stats?: {
    totalPrints: number;
    monthlyVolume: number;
    averageMonthly: number;
    uptime: number;
  };
  supplies?: {
    black: number;
    cyan?: number;
    magenta?: number;
    yellow?: number;
  };
}

export interface PrinterLog {
  id: string;
  timestamp: string;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  printerId?: string;
  details?: string;
  pages?: number;
}

export interface PrinterActivity {
  id: string;
  timestamp: string;
  printer: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    name: string;
  };
  type: 'print' | 'maintenance' | 'status' | 'supply';
  message: string;
  action?: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  details?: string;
}
