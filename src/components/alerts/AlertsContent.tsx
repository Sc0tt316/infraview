
import React from 'react';
import { RefreshCw } from 'lucide-react';
import AlertsTable from '@/components/alerts/AlertsTable';
import EmptyAlertState from '@/components/alerts/EmptyAlertState';
import { Alert } from '@/types/alerts';

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
    <AlertsTable
      alerts={filteredAlerts}
      onResolveAlert={onResolveAlert}
      onViewDetails={onViewDetails}
    />
  );
};

export default AlertsContent;
