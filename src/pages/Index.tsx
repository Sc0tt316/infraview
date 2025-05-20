
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { printers = [], refetch: refetchPrinters } = usePrinters();
  const [alerts, setAlerts] = useState([]);
  
  // Auto-refresh interval in milliseconds (30 seconds)
  const AUTO_REFRESH_INTERVAL = 30000;

  // Fetch recent activities
  const { data: recentActivities = [], refetch: refetchActivities } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => printerService.getAllActivities(),
  });

  // Function to refresh all dashboard data
  const refreshDashboardData = useCallback(async () => {
    try {
      await Promise.all([
        refetchPrinters(),
        refetchActivities(),
        fetchAlerts()
      ]);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    }
  }, [refetchPrinters, refetchActivities]);

  // Fetch alerts
  const fetchAlerts = async () => {
    try {
      const alertsData = await analyticsService.getAlerts({ limit: 5 });
      setAlerts(alertsData || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setAlerts([]);
    }
  };
  
  // Set up auto-refresh for dashboard with improved cleanup and dependencies
  useEffect(() => {
    // Fetch initial data
    fetchAlerts();
    
    // Setup interval with proper cleanup (no consent check needed)
    const intervalId = setInterval(refreshDashboardData, AUTO_REFRESH_INTERVAL);
    
    // Cleanup function to clear interval
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [refreshDashboardData]); // Only refreshDashboardData as dependency

  // Handler to navigate to the alerts page
  const handleViewAllAlerts = () => {
    navigate('/alerts');
  };

  return (
    <MainDashboard 
      printers={printers} 
      recentActivities={recentActivities} 
      alerts={alerts}
      onViewAllAlerts={handleViewAllAlerts}
    />
  );
};

export default Index;
