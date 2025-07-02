
import React from 'react';
import { PrinterData } from '@/types/printers';
import { ServerData } from '@/types/servers';
import StatsOverview from '@/components/dashboard/StatsOverview';
import PrinterStatusSummary from '@/components/dashboard/PrinterStatusSummary';
import RecentActivity from '@/components/dashboard/RecentActivity';
import AlertsOverview from '@/components/dashboard/AlertsOverview';
import LowSuppliesWarning from '@/components/dashboard/LowSuppliesWarning';

export interface MainDashboardProps {
  printers: PrinterData[];
  servers: ServerData[];
  recentActivities: any[];
  alerts: any[];
  onViewAllAlerts: () => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({
  printers = [],
  servers = [],
  recentActivities = [],
  alerts = [],
  onViewAllAlerts
}) => {
  const activeAlerts = alerts?.filter(alert => !alert.isResolved)?.length || 0;

  return (
    <div className="space-y-6">
      <StatsOverview printers={printers} servers={servers} activeAlerts={activeAlerts} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PrinterStatusSummary printers={printers} />
        
        <RecentActivity activities={recentActivities} />
        
        <AlertsOverview
          alerts={alerts}
          onViewAllAlerts={onViewAllAlerts}
        />
        
        <LowSuppliesWarning printers={printers} />
      </div>
    </div>
  );
};

export default MainDashboard;
