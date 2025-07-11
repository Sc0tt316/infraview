
// Updated PrinterData interface to include all the properties needed
export interface PrinterData {
  id: string;
  name: string;
  model: string;
  location: string;
  status: 'online' | 'offline' | 'error' | 'warning' | 'maintenance';
  subStatus?: string;
  inkLevel: number;
  paperLevel: number;
  jobCount?: number;
  lastActive?: string;
  ipAddress?: string;
  department?: string;
  logs?: PrintLog[];
  serialNumber?: string;
  addedDate?: string;
  supplies?: SuppliesData;
  stats?: PrinterStats;
}

// SuppliesData interface (updated from Supply[] to an object)
export interface SuppliesData {
  black: number;
  cyan?: number;
  magenta?: number;
  yellow?: number;
  waste?: number;
}

// Individual Supply interface
export interface Supply {
  type: string;
  level: number;
  color?: string;
}

// PrinterStats interface with updated fields
export interface PrinterStats {
  dailyPrints: number;
  weeklyPrints: number;
  monthlyPrints: number;
  totalPrints: number;
  totalPages?: number;
  monthlyPages?: number;
  jams?: number;
}

// PrintLog interface
export interface PrintLog {
  id?: string;
  printerId: string;
  fileName: string;
  status: 'completed' | 'failed' | 'pending';
  timestamp: string;
  pages: number;
  size: string;
  user: string;
}

// PrinterActivity interface updated with required printerName
export interface PrinterActivity {
  id: string;
  printerId: string;
  printerName: string;
  action: string;
  timestamp: string;
  user?: string;
  details?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

// ActivityItem interface with description and message fields
export interface ActivityItem {
  id: string;
  type: 'print' | 'maintenance' | 'alert' | 'supply';
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
}
