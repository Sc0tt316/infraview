
import React from 'react';
import { PrinterData, PrinterActivity } from '@/types/printers';
import PrinterStatusSummary from '@/components/dashboard/PrinterStatusSummary';
import RecentActivity from '@/components/dashboard/RecentActivity';
import AlertsOverview from '@/components/dashboard/AlertsOverview';
import LowSuppliesWarning from '@/components/dashboard/LowSuppliesWarning';

interface MainDashboardProps {
  printers: PrinterData[];
  recentActivities: PrinterActivity[];
  alerts: any[];
  onViewAllAlerts: () => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({
  printers,
  recentActivities,
  alerts,
  onViewAllAlerts
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <PrinterStatusSummary printers={printers} />
      
      <RecentActivity activities={recentActivities} />
      
      <AlertsOverview
        alerts={alerts}
        onViewAllAlerts={onViewAllAlerts}
      />
      
      <LowSuppliesWarning printers={printers} />
    </div>
  );
};

export default MainDashboard;
