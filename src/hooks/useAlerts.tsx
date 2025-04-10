
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertFilter, AlertSeverity } from '@/types/alerts';
import { apiService } from '@/services/api';

export const useAlerts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AlertFilter>('all');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [relatedToFilter, setRelatedToFilter] = useState<'all' | 'user' | 'printer'>('all');
  
  const { toast } = useToast();
  
  // Load alerts
  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      // Get alerts from API service
      const storedAlerts = await apiService.get<Alert[]>('alerts');
      
      if (storedAlerts && storedAlerts.length > 0) {
        setAlerts(storedAlerts);
      } else {
        // Create empty alerts array if none exist
        setAlerts([]);
      }
    } catch (error) {
      console.error("Error loading alerts:", error);
      toast({
        variant: "destructive",
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
          return !!alert.printer; // Has printer information
        } else if (relatedToFilter === 'user') {
          return !alert.printer; // No printer = user related
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
      
      // Type casting to make TypeScript happy
      const aSeverity = a.severity as keyof typeof severityOrder;
      const bSeverity = b.severity as keyof typeof severityOrder;
      
      return severityOrder[aSeverity] - severityOrder[bSeverity];
    });
    
    setFilteredAlerts(result);
  }, [alerts, searchTerm, statusFilter, severityFilter, relatedToFilter]);
  
  // Resolve alert with persistence
  const resolveAlert = async (alertId: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId
        ? {
            ...alert,
            isResolved: true,
            resolvedAt: new Date().toISOString(),
            resolvedBy: "Admin User"
          }
        : alert
    );
    
    // Update state
    setAlerts(updatedAlerts);
    
    // Save to localStorage via apiService
    await apiService.post('alerts', updatedAlerts);
    
    toast({
      title: "Alert Resolved",
      description: "The alert has been marked as resolved."
    });
  };
  
  // Resolve all alerts
  const resolveAllAlerts = async () => {
    // Only resolve alerts that are not already resolved
    const updatedAlerts = alerts.map(alert => 
      !alert.isResolved
        ? {
            ...alert,
            isResolved: true,
            resolvedAt: new Date().toISOString(),
            resolvedBy: "Admin User"
          }
        : alert
    );
    
    // Update state
    setAlerts(updatedAlerts);
    
    // Save to localStorage via apiService
    await apiService.post('alerts', updatedAlerts);
  };
  
  // Clear all resolved alerts
  const clearResolvedAlerts = async () => {
    // Keep only the active alerts
    const updatedAlerts = alerts.filter(alert => !alert.isResolved);
    
    // Update state
    setAlerts(updatedAlerts);
    
    // Save to localStorage via apiService
    await apiService.post('alerts', updatedAlerts);
  };
  
  // Refresh alerts
  const refreshAlerts = () => {
    loadAlerts();
    toast({
      title: "Refreshed",
      description: "Alert data has been refreshed."
    });
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
