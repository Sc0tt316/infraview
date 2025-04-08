
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PrinterData } from '@/types/printers';
import { Alert } from '@/types/alerts';
import { PrinterActivity } from '@/types/printers';
import StatsOverview from '@/components/dashboard/StatsOverview';
import PrinterStatusSummary from '@/components/dashboard/PrinterStatusSummary';
import RecentActivity from '@/components/dashboard/RecentActivity';
import AlertsOverview from '@/components/dashboard/AlertsOverview';
import LowSuppliesWarning from '@/components/dashboard/LowSuppliesWarning';
import SystemStatus from '@/components/dashboard/SystemStatus';
import { useNavigate } from 'react-router-dom';

interface DashboardContentProps {
  printers: PrinterData[];
  recentActivities: PrinterActivity[];
  alerts: Alert[];
  activeAlerts: number;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  printers,
  recentActivities,
  alerts,
  activeAlerts
}) => {
  const navigate = useNavigate();
  
  const handleViewAllPrinters = () => navigate('/printers');
  const handleViewAllActivity = () => navigate('/activity');
  const handleViewAllAlerts = () => navigate('/alerts');
  
  return (
    <>
      <StatsOverview 
        printers={printers} 
        activeAlerts={activeAlerts} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="col-span-1">
          <CardContent className="p-0">
            <PrinterStatusSummary
              printers={printers}
              onViewAllPrinters={handleViewAllPrinters}
            />
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2">
          <CardContent className="p-0">
            <RecentActivity
              activities={recentActivities}
              onViewAllActivity={handleViewAllActivity}
            />
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardContent className="p-0">
            <AlertsOverview
              alerts={alerts}
              onViewAllAlerts={handleViewAllAlerts}
            />
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardContent className="p-0">
            <LowSuppliesWarning printers={printers} />
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-3">
          <CardContent className="p-0">
            <SystemStatus />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DashboardContent;
