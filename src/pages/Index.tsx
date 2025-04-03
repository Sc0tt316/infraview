
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Printer, FileText, RefreshCw, AlertTriangle, 
  Ban, Zap, CheckCircle, RotateCw
} from 'lucide-react';
import { printerService } from '@/services/printer';
import { PrinterActivity } from '@/types/printers';
import StatsCard from '@/components/dashboard/StatsCard';
import PrinterStatusSummary from '@/components/dashboard/PrinterStatusSummary';
import RecentActivity from '@/components/dashboard/RecentActivity';
import AlertsOverview from '@/components/dashboard/AlertsOverview';
import LowSuppliesWarning from '@/components/dashboard/LowSuppliesWarning';

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<PrinterActivity[]>([]);
  const [alerts, setAlerts] = useState([
    {
      id: "a1",
      title: "Paper jam detected",
      description: "Marketing Printer (Epson WorkForce Pro) has a paper jam in tray 2.",
      timestamp: new Date().toISOString(),
      severity: "medium",
      isResolved: false
    },
    {
      id: "a2",
      title: "Toner critically low",
      description: "Executive Printer (Canon PIXMA) black toner at 5%.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      severity: "high",
      isResolved: false
    },
    {
      id: "a3",
      title: "Connection lost",
      description: "Conference Room Printer (Brother MFC) went offline unexpectedly.",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      severity: "low",
      isResolved: false
    }
  ]);

  // Fetch printers data
  const { data: printers = [] } = useQuery({
    queryKey: ['printers'],
    queryFn: () => printerService.getAllPrinters(),
  });
  
  // Load activities on component mount
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const activities = await printerService.getAllActivities();
        // Sort by timestamp descending and take the 5 most recent
        const sortedActivities = activities
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5);
        setRecentActivities(sortedActivities);
      } catch (error) {
        console.error("Error loading activities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadActivities();
  }, []);
  
  // Calculate stats
  const totalPrinters = printers.length;
  const onlinePrinters = printers.filter(p => p.status === 'online').length;
  const errorPrinters = printers.filter(p => p.status === 'error').length;
  const offlinePrinters = printers.filter(p => p.status === 'offline').length;
  const maintenancePrinters = printers.filter(p => p.status === 'maintenance').length;
  
  // Calculate alerts
  const activeAlerts = alerts.filter(alert => !alert.isResolved).length;
  
  // Navigation handlers
  const handleViewAllPrinters = () => navigate('/printers');
  const handleViewAllActivity = () => navigate('/activity');
  const handleViewAllAlerts = () => navigate('/alerts');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your printing system
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : (
        <>
          {/* Stats overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Printers"
              value={totalPrinters}
              icon={Printer}
            />
            <StatsCard
              title="Online Printers"
              value={onlinePrinters}
              icon={CheckCircle}
            />
            <StatsCard
              title="Print Jobs Today"
              value={178}
              icon={FileText}
              description="Completed and pending"
            />
            <StatsCard
              title="Active Alerts"
              value={activeAlerts}
              icon={AlertTriangle}
              trend={activeAlerts > 1 ? { value: 12, isPositive: false } : undefined}
            />
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status and activity */}
            <PrinterStatusSummary
              printers={printers}
              onViewAllPrinters={handleViewAllPrinters}
            />
            
            <RecentActivity
              activities={recentActivities}
              onViewAllActivity={handleViewAllActivity}
            />
            
            <AlertsOverview
              alerts={alerts}
              onViewAllAlerts={handleViewAllAlerts}
            />
            
            <LowSuppliesWarning printers={printers} />
          </div>

          {/* System Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-green-50 flex items-center justify-center rounded-full mr-3">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Print Server</p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-green-50 flex items-center justify-center rounded-full mr-3">
                    <RefreshCw className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Print Queue</p>
                    <p className="text-xs text-muted-foreground">Operational</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-green-50 flex items-center justify-center rounded-full mr-3">
                    <Ban className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Error Rate</p>
                    <p className="text-xs text-muted-foreground">Normal (2.3%)</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-green-50 flex items-center justify-center rounded-full mr-3">
                    <RotateCw className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Sync</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Index;
