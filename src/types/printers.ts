
// If the file exists, add the PrintLog interface and update PrinterData
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

export interface PrinterData {
  id: string;
  name: string;
  model: string;
  location: string;
  status: 'online' | 'offline' | 'error' | 'warning';
  inkLevel: number;
  paperLevel: number;
  jobCount?: number;
  lastActive?: string;
  ipAddress?: string;
  department?: string;
  logs?: PrintLog[];
}
