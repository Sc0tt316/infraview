
export interface Alert {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  printer?: {
    id: string;
    name: string;
    location?: string;
  };
  user?: {
    id: string;
    name: string;
    email?: string;
  };
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertFilter = 'all' | 'active' | 'resolved';
