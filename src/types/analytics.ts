
export interface AnalyticsData {
  summary: {
    totalPrinters: number;
    activePrinters: number;
    totalVolume: number;
    activeJobs: number;
    completedJobs: number;
    failedJobs: number;
    totalUsers: number;
    departmentVolume: DepartmentVolume[];
  };
  printerStatus: {
    online: number;
    offline: number;
    error: number;
    warning: number;
    maintenance: number;
  };
}

export interface DepartmentVolume {
  department: string;
  volume: number;
}

export interface ActivityLogData {
  id: string;
  timestamp: string;
  action?: string;
  message?: string;
  entityType?: string;
  entityId?: string;
  user?: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface PrintVolumeData {
  date: string;
  volume: number;
}

export interface AnalyticsServiceInterface {
  getAnalyticsData: () => Promise<AnalyticsData>;
  getPrintVolumeData: (dateRange: string) => Promise<PrintVolumeData[]>;
  getActivityLogs: (params?: { limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }) => Promise<ActivityLogData[]>;
  getAlertMetrics: () => Promise<{ total: number; active: number; critical: number }>;
}
