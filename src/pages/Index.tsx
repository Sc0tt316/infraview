
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { printerService } from '@/services/printer';
import { PrinterActivity } from '@/types/printers';

// Import our new components
import StatsOverview from '@/components/dashboard/StatsOverview';
import MainDashboard from '@/components/dashboard/MainDashboard';
import SystemStatus from '@/components/dashboard/SystemStatus';

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
          <StatsOverview 
            printers={printers} 
            activeAlerts={activeAlerts} 
          />

          {/* Main Dashboard Content */}
          <MainDashboard 
            printers={printers}
            recentActivities={recentActivities}
            alerts={alerts}
            onViewAllPrinters={handleViewAllPrinters}
            onViewAllActivity={handleViewAllActivity}
            onViewAllAlerts={handleViewAllAlerts}
          />

          {/* System Status */}
          <SystemStatus />
        </>
      )}
    </div>
  );
};

export default Index;
