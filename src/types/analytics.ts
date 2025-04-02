
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
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  printerStatus: PrinterStatus;
}

export interface ActivityLogData {
  id: string;
  timestamp: string;
  entityId: string;
  entityType: string;
  type: "success" | "error" | "info" | "warning";
  message?: string;
  user?: string;
  action?: string;
}

export interface AlertData {
  id: string;
  timestamp: string;
  title: string;
  level: "critical" | "warning" | "info";
  status: "active" | "resolved";
  message?: string;
  printer?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    name: string;
  };
}

export interface PrintVolumeData {
  date: string;
  count: number;
}
