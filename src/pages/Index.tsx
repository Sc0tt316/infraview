
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { PrinterActivity } from '@/types/printers';
import { Alert } from '@/types/alerts';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<PrinterActivity[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([
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
      <DashboardHeader onRefresh={handleRefresh} isLoading={isLoading} />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : (
        <DashboardContent 
          printers={printers}
          recentActivities={recentActivities}
          alerts={alerts}
          activeAlerts={activeAlerts}
        />
      )}
    </div>
  );
};

export default Index;
