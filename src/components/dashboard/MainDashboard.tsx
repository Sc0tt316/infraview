
import React from 'react';
import { PrinterData } from '@/types/printers';
import StatsOverview from '@/components/dashboard/StatsOverview';
import PrinterStatusSummary from '@/components/dashboard/PrinterStatusSummary';
import RecentActivity from '@/components/dashboard/RecentActivity';
import AlertsOverview from '@/components/dashboard/AlertsOverview';
import LowSuppliesWarning from '@/components/dashboard/LowSuppliesWarning';
import SystemStatus from '@/components/dashboard/SystemStatus';

export interface MainDashboardProps {
  printers: PrinterData[];
  recentActivities: any[]; // Using any for now since PrinterActivity is not in allowed files
  alerts: any[];
  onViewAllAlerts: () => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({
  printers = [],
  recentActivities = [],
  alerts = [],
  onViewAllAlerts
}) => {
  const activeAlerts = alerts?.filter(alert => !alert.isResolved)?.length || 0;

  return (
    <div className="space-y-6">
      <StatsOverview printers={printers} activeAlerts={activeAlerts} />
      
      <SystemStatus />
      
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
