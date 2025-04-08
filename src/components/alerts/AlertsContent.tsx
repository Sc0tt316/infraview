
import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import AlertsTable from '@/components/alerts/AlertsTable';
import EmptyAlertState from '@/components/alerts/EmptyAlertState';
import { Alert } from '@/types/alerts';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface AlertsContentProps {
  isLoading: boolean;
  filteredAlerts: Alert[];
  onResolveAlert: (alertId: string) => void;
  onViewDetails: (alert: Alert) => void;
}

const AlertsContent: React.FC<AlertsContentProps> = ({
  isLoading,
  filteredAlerts,
  onResolveAlert,
  onViewDetails
}) => {
  // Function to get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Badge className="bg-blue-500">Low</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">Medium</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
      </div>
    );
  }
  
  if (filteredAlerts.length === 0) {
    return <EmptyAlertState />;
  }
  
  return (
    <div className="space-y-5">
      {filteredAlerts.map(alert => (
        <div key={alert.id} className="bg-gray-900 p-4 rounded-lg border border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors" onClick={() => onViewDetails(alert)}>
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-white">{alert.title}</h3>
            {getSeverityBadge(alert.severity)}
          </div>
          <p className="text-gray-400 mt-1">{alert.description}</p>
          <div className="text-xs text-gray-500 mt-2">
            {format(new Date(alert.timestamp), 'MMM d, h:mm a')}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertsContent;
