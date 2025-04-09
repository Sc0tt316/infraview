
import { useState, useEffect, useCallback } from 'react';
import { Alert, AlertFilter, AlertSeverity } from '@/types/alerts';
import { analyticsService } from '@/services/analytics';
import { toast } from 'sonner';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AlertFilter>('all');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');

  // Fetch alerts on component mount
  const fetchAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedAlerts = await analyticsService.getAlerts();
      // Transform AlertData to Alert
      const transformedAlerts: Alert[] = fetchedAlerts.map(alert => ({
        id: alert.id,
        title: alert.title,
        description: alert.description || '', 
        timestamp: alert.timestamp,
        severity: alert.severity as AlertSeverity,
        printer: alert.printer ? {
          id: alert.printer.id,
          name: alert.printer.name,
          location: alert.printer.name || 'Unknown', // Ensure location is not undefined
        } : undefined,
        isResolved: alert.resolved || false,
        resolvedAt: alert.status === 'resolved' ? new Date().toISOString() : undefined,
        resolvedBy: alert.user?.name
      }));
      setAlerts(transformedAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to fetch alerts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Apply filters to alerts
  useEffect(() => {
    let filtered = alerts;

    // Apply search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        alert =>
          alert.title.toLowerCase().includes(searchTermLower) ||
          alert.description.toLowerCase().includes(searchTermLower)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      const isResolved = statusFilter === 'resolved';
      filtered = filtered.filter(alert => alert.isResolved === isResolved);
    }

    // Apply severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }

    setFilteredAlerts(filtered);
  }, [alerts, searchTerm, statusFilter, severityFilter]);

  // Resolve an alert
  const resolveAlert = async (alertId: string) => {
    try {
      await analyticsService.resolveAlert(alertId);
      
      // Update local state
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, isResolved: true, resolvedAt: new Date().toISOString() } 
            : alert
        )
      );
      
      toast.success('Alert resolved successfully');
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Failed to resolve alert');
    }
  };

  // Clear all resolved alerts
  const clearResolvedAlerts = () => {
    setAlerts(prev => prev.filter(alert => !alert.isResolved));
    toast.success('Resolved alerts cleared');
  };

  // Resolve all alerts
  const resolveAllAlerts = async () => {
    try {
      // Get all unresolved alerts
      const unresolvedAlerts = alerts.filter(alert => !alert.isResolved);
      
      // Update all unresolved alerts to resolved
      setAlerts(prev => 
        prev.map(alert => 
          !alert.isResolved 
            ? { ...alert, isResolved: true, resolvedAt: new Date().toISOString() } 
            : alert
        )
      );
      
      // Try to resolve each alert with the API
      for (const alert of unresolvedAlerts) {
        await analyticsService.resolveAlert(alert.id);
      }
      
      toast.success('All alerts resolved');
    } catch (error) {
      console.error('Error resolving all alerts:', error);
      toast.error('Failed to resolve all alerts');
      // Refresh the alerts to ensure state is consistent with server
      fetchAlerts();
    }
  };

  // Refresh alerts
  const refreshAlerts = () => {
    fetchAlerts();
  };

  return {
    alerts,
    filteredAlerts,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    severityFilter,
    setSeverityFilter,
    resolveAlert,
    refreshAlerts,
    clearResolvedAlerts,
    resolveAllAlerts
  };
};
