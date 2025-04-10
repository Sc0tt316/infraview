
import React from 'react';
import { PrinterData } from '@/types/printers';
import PrinterStatusSummary from '@/components/dashboard/PrinterStatusSummary';
import RecentActivity from '@/components/dashboard/RecentActivity';
import AlertsOverview from '@/components/dashboard/AlertsOverview';
import LowSuppliesWarning from '@/components/dashboard/LowSuppliesWarning';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MainDashboardProps {
  printers: PrinterData[];
  recentActivities: any[]; // Using any for now since PrinterActivity is not in allowed files
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Printer Status</CardTitle>
          </CardHeader>
          <CardContent>
            <PrinterStatusSummary printers={printers} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={recentActivities} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertsOverview
              alerts={alerts}
              onViewAllAlerts={onViewAllAlerts}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Supply Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <LowSuppliesWarning printers={printers} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainDashboard;
