
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainDashboard from '@/components/dashboard/MainDashboard';
import { usePrinters } from '@/hooks/usePrinters';
import { useServers } from '@/hooks/useServers';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { analyticsService } from '@/services/analytics';
import { supabase } from '@/integrations/supabase/client';

/**
 * Index page that serves as the main dashboard
 */
const Index: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { printers = [], refetch: refetchPrinters } = usePrinters();
  const { servers = [], refetch: refetchServers } = useServers();
  const [alerts, setAlerts] = useState([]);
  
  // Auto-refresh interval in milliseconds (30 seconds)
  const AUTO_REFRESH_INTERVAL = 30000;

  // Fetch recent activities from database
  const { data: recentActivities = [], refetch: refetchActivities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('printer_activities')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        return data.map(activity => ({
          id: activity.id,
          printerId: activity.printer_id,
          printerName: activity.printer_name,
          action: activity.action,
          timestamp: activity.timestamp,
          status: activity.status || 'info',
          details: activity.details || '',
          user: activity.user_id || ''
        }));
      } catch (error) {
        console.error('Error fetching printer activities:', error);
        return [];
      }
    }
  });

  // Function to refresh all dashboard data
  const refreshDashboardData = useCallback(async () => {
    try {
      await Promise.all([
        refetchPrinters(),
        refetchServers(),
        refetchActivities(),
        fetchAlerts()
      ]);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    }
  }, [refetchPrinters, refetchServers, refetchActivities]);

  // Fetch alerts from database
  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      const formattedAlerts = data.map(alert => ({
        id: alert.id,
        title: alert.title,
        description: alert.description,
        timestamp: alert.created_at,
        severity: alert.severity,
        isResolved: alert.is_resolved,
        resolvedAt: alert.resolved_at,
        resolvedBy: alert.resolved_by,
        printer: {
          id: alert.printer_id,
          name: '' // Would be populated in a real implementation
        }
      }));
      
      setAlerts(formattedAlerts || []);
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

  // Set up realtime listener for alerts
  useEffect(() => {
    const alertsChannel = supabase
      .channel('alerts-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'alerts' },
        (payload) => {
          // Refresh alerts when there's any change
          fetchAlerts();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(alertsChannel);
    };
  }, []);

  // Handler to navigate to the alerts page
  const handleViewAllAlerts = () => {
    navigate('/alerts');
  };

  return (
    <MainDashboard 
      printers={printers}
      servers={servers}
      recentActivities={recentActivities} 
      alerts={alerts}
      onViewAllAlerts={handleViewAllAlerts}
    />
  );
};

export default Index;
