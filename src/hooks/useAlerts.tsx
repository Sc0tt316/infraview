import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertFilter, AlertSeverity } from '@/types/alerts';
import { alertService } from '@/services/analytics/alertService';

export const useAlerts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AlertFilter>('all');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [relatedToFilter, setRelatedToFilter] = useState<'all' | 'user' | 'printer'>('all');
  
  // Helper function to map severity levels
  const mapSeverityLevel = (level: 'critical' | 'warning' | 'info'): AlertSeverity => {
    switch (level) {
      case 'critical':
        return 'critical';
      case 'warning':
        return 'medium';
      case 'info':
        return 'low';
      default:
        return 'low';
    }
  };
  
  // Load alerts from Supabase
  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const alertsData = await alertService.getAlerts({
        limit: 100,
        status: 'all',
        level: 'all',
        sortBy: 'timestamp',
        sortOrder: 'desc'
      });
      
      // Transform AlertData to Alert format
      const transformedAlerts: Alert[] = alertsData.map(alertData => ({
        id: alertData.id,
        title: alertData.title,
        description: alertData.description || alertData.message,
        timestamp: alertData.timestamp,
        severity: mapSeverityLevel(alertData.level),
        printer: alertData.printer ? {
          id: alertData.printer.id,
          name: alertData.printer.name
        } : undefined,
        user: alertData.user,
        isResolved: alertData.resolved,
        resolvedAt: alertData.resolved_at,
        resolvedBy: undefined
      }));
      
      setAlerts(transformedAlerts);
    } catch (error) {
      console.error("Error loading alerts:", error);
      toast({
        title: "Error",
        description: "Failed to load alerts. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load data initially
  useEffect(() => {
    loadAlerts();
  }, []);
  
  // Apply filters whenever any filter changes
  useEffect(() => {
    let result = [...alerts];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(alert => 
        alert.title.toLowerCase().includes(lowerSearchTerm) ||
        alert.description.toLowerCase().includes(lowerSearchTerm) ||
        (alert.printer?.name.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(alert => 
        (statusFilter === 'active' && !alert.isResolved) || 
        (statusFilter === 'resolved' && alert.isResolved)
      );
    }
    
    // Apply severity filter
    if (severityFilter !== 'all') {
      result = result.filter(alert => alert.severity === severityFilter);
    }
    
    // Apply related-to filter
    if (relatedToFilter !== 'all') {
      result = result.filter(alert => {
        if (relatedToFilter === 'printer') {
          return !!alert.printer;
        } else if (relatedToFilter === 'user') {
          return !alert.printer;
        }
        return true;
      });
    }
    
    // Sort by severity (critical first)
    result = result.sort((a, b) => {
      const severityOrder = { 
        critical: 0, 
        high: 1, 
        medium: 2, 
        low: 3 
      };
      
      const aSeverity = a.severity as keyof typeof severityOrder;
      const bSeverity = b.severity as keyof typeof severityOrder;
      
      return severityOrder[aSeverity] - severityOrder[bSeverity];
    });
    
    setFilteredAlerts(result);
  }, [alerts, searchTerm, statusFilter, severityFilter, relatedToFilter]);
  
  // Resolve alert with persistence
  const resolveAlert = async (alertId: string) => {
    const success = await alertService.resolveAlert(alertId);
    if (success) {
      await loadAlerts();
    }
  };
  
  // Resolve all alerts
  const resolveAllAlerts = async () => {
    const unresolvedAlerts = alerts.filter(alert => !alert.isResolved);
    for (const alert of unresolvedAlerts) {
      await alertService.resolveAlert(alert.id);
    }
    await loadAlerts();
  };
  
  // Clear all resolved alerts
  const clearResolvedAlerts = async () => {
    const success = await alertService.clearResolvedAlerts();
    if (success) {
      await loadAlerts();
    }
  };
  
  // Refresh alerts
  const refreshAlerts = () => {
    loadAlerts();
  };
  
  return {
    isLoading,
    alerts,
    filteredAlerts,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    severityFilter,
    setSeverityFilter,
    relatedToFilter,
    setRelatedToFilter,
    resolveAlert,
    resolveAllAlerts,
    clearResolvedAlerts,
    refreshAlerts
  };
};
