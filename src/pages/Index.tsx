
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainDashboard from '@/components/dashboard/MainDashboard';
import { usePrinters } from '@/hooks/usePrinters';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { analyticsService } from '@/services/analytics';

/**
 * Index page that serves as the main dashboard
 */
const Index: React.FC = () => {
  const { user } = useAuth();
  const { printers = [] } = usePrinters();
  const [alerts, setAlerts] = useState([]);

  // Fetch recent activities
  const { data: recentActivities = [] } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => printerService.getAllActivities(),
  });

  // Fetch alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const alertsData = await analyticsService.getAlerts({ limit: 5 });
        setAlerts(alertsData || []);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        setAlerts([]);
      }
    };
    
    fetchAlerts();
  }, []);

  return (
    <MainDashboard 
      printers={printers} 
      recentActivities={recentActivities} 
      alerts={alerts}
    />
  );
};

export default Index;
