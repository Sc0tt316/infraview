
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { PrinterActivity } from '@/types/printers';

// Import our components
import StatsOverview from '@/components/dashboard/StatsOverview';
import PrinterStatusSummary from '@/components/dashboard/PrinterStatusSummary';
import RecentActivity from '@/components/dashboard/RecentActivity';
import AlertsOverview from '@/components/dashboard/AlertsOverview';
import LowSuppliesWarning from '@/components/dashboard/LowSuppliesWarning';
import SystemStatus from '@/components/dashboard/SystemStatus';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

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
  
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  // Fetch printers data
  const { data: printers = [], refetch } = useQuery({
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
  
  // Update printer levels automatically
  useEffect(() => {
    const updateLevels = async () => {
      if (printers.length > 0) {
        const updatedPrinters = await Promise.all(
          printers.map(async (printer) => {
            const updated = await printerService.updatePrinterLevels(printer);
            return { ...printer, ...updated };
          })
        );
        
        // Refetch printers to get updated data
        refetch();
      }
    };
    
    updateLevels();
    
    // Update levels periodically (every 5 minutes)
    const interval = setInterval(updateLevels, 300000);
    
    return () => clearInterval(interval);
  }, [printers, refetch]);
  
  // Calculate alerts
  const activeAlerts = alerts.filter(alert => !alert.isResolved).length;
  
  // Navigation handlers
  const handleViewAllPrinters = () => navigate('/printers');
  const handleViewAllActivity = () => navigate('/activity');
  const handleViewAllAlerts = () => navigate('/alerts');
  
  // Refresh dashboard data
  const handleRefresh = () => {
    setIsLoading(true);
    refetch().then(() => {
      printerService.getAllActivities().then(activities => {
        const sortedActivities = activities
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5);
        setRecentActivities(sortedActivities);
        setIsLoading(false);
      });
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your printing system
          </p>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : (
        <>
          {/* Stats overview */}
          <StatsOverview 
            printers={printers} 
            activeAlerts={activeAlerts} 
          />

          {/* Main Dashboard Content */}
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
      )}
    </div>
  );
};

export default Index;
