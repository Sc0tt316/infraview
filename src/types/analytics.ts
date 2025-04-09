
// Defining shared types for analytics data

export interface DepartmentVolume {
  department: string;
  volume: number;
}

export interface PrinterStatus {
  online: number;
  offline: number;
  error: number;
  warning: number;
  maintenance: number;
}

export interface AnalyticsSummary {
  totalPrinters: number;
  totalUsers: number;
  departmentVolume: DepartmentVolume[];
  totalVolume: number;
  activePrinters: number;
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  printerStatus: PrinterStatus;
  departmentVolume: DepartmentVolume[];
}

export interface PrintVolumeData {
  date: string;
  volume: number;
}

export interface ActivityLogData {
  id: string;
  timestamp: string;
  entityId: string;
  entityType: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  user: string;
  action: string;
  userName?: string;
  userId?: string;
  description?: string;
}

export interface AlertData {
  id: string;
  timestamp: string;
  title: string;
  level: "critical" | "warning" | "info";
  status: "active" | "resolved";
  message: string;
  description?: string;
  resolved?: boolean;
  timeAgo?: string;
  entityId?: string;
  entityType?: string;
  entityName?: string;
  severity?: string;
  isResolved?: boolean;
  printer?: {
    id: string;
    name: string;
    location?: string;
  };
  user?: {
    id: string;
    name: string;
  };
}

// Define analytics service interface
export interface AnalyticsServiceInterface {
  getAnalyticsData(): Promise<AnalyticsData>;
  getPrintVolumeData(options?: { timeRange?: string; from?: Date; to?: Date }): Promise<PrintVolumeData[]>;
  getActivityLogs(options?: { limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }): Promise<ActivityLogData[]>;
  getAlerts(options?: { 
    limit?: number; 
    status?: 'all' | 'active' | 'resolved'; 
    level?: 'all' | 'critical' | 'warning' | 'info'; 
    sortBy?: string; 
    sortOrder?: 'asc' | 'desc' 
  }): Promise<AlertData[]>;
  resolveAlert(alertId: string): Promise<boolean>;
}
