
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AlertFilter = 'all' | 'resolved' | 'unresolved';

export interface AlertPrinter {
  id: string;
  name: string;
  location?: string; // Make location optional to match API data
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: AlertSeverity;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  printer?: AlertPrinter;
}

export interface AlertData {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  severity: string;
  printer?: {
    id: string;
    name: string;
    location?: string;
  };
  resolved?: boolean;
  status?: string;
  user?: {
    name: string;
    id: string;
  };
}
