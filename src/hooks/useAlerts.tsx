
import { useState, useEffect } from 'react';
import { printerService } from '@/services/printer';
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
  
  const { toast } = useToast();
  
  // Load alerts from local storage or generate mock data
  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      // Try to get alerts from API service (localStorage)
      const storedAlerts = await apiService.get<Alert[]>('alerts');
      
      if (storedAlerts && storedAlerts.length > 0) {
        setAlerts(storedAlerts);
      } else {
        // Generate mock alerts if none exist
        await generateMockAlerts();
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
  
  // Generate mock alerts function with a larger dataset
  const generateMockAlerts = async () => {
    try {
      // Get printers for the mock data
      const printers = await printerService.getAllPrinters();
      
      // Generate more mock alerts
      const mockAlerts: Alert[] = [
        {
          id: "a1",
          title: "Paper jam detected",
          description: "Paper jam detected in the main tray. Please check and clear any jammed paper.",
          timestamp: new Date().toISOString(),
          severity: "medium",
          printer: printers[2] ? {
            id: printers[2].id,
            name: printers[2].name,
            location: printers[2].location
          } : undefined,
          isResolved: false
        },
        {
          id: "a2",
          title: "Toner critically low",
          description: "Black toner cartridge is at 5% remaining. Please replace soon to avoid disruption.",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          severity: "high",
          printer: printers[1] ? {
            id: printers[1].id,
            name: printers[1].name,
            location: printers[1].location
          } : undefined,
          isResolved: false
        },
        {
          id: "a3",
          title: "Connection lost",
          description: "Printer went offline unexpectedly. Check network connection and power.",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          severity: "low",
          printer: printers[3] ? {
            id: printers[3].id,
            name: printers[3].name,
            location: printers[3].location
          } : undefined,
          isResolved: false
        },
        {
          id: "a4",
          title: "System update required",
          description: "A critical firmware update is available for this printer. Please update as soon as possible.",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          severity: "critical",
          printer: printers[0] ? {
            id: printers[0].id,
            name: printers[0].name,
            location: printers[0].location
          } : undefined,
          isResolved: true,
          resolvedAt: new Date(Date.now() - 43200000).toISOString(),
          resolvedBy: "John Admin"
        },
        {
          id: "a5",
          title: "Low memory warning",
          description: "Printer is experiencing low memory. Large print jobs may fail.",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          severity: "medium",
          printer: printers[4] ? {
            id: printers[4].id,
            name: printers[4].name,
            location: printers[4].location
          } : undefined,
          isResolved: true,
          resolvedAt: new Date(Date.now() - 129600000).toISOString(),
          resolvedBy: "System"
        },
        {
          id: "a6",
          title: "Paper size mismatch",
          description: "Print job requires A3 paper but only A4 is loaded.",
          timestamp: new Date(Date.now() - 240000).toISOString(),
          severity: "medium",
          printer: printers[1] ? {
            id: printers[1].id,
            name: printers[1].name,
            location: printers[1].location
          } : undefined,
          isResolved: false
        },
        {
          id: "a7",
          title: "Network configuration error",
          description: "Printer has an invalid IP configuration. Please check network settings.",
          timestamp: new Date(Date.now() - 900000).toISOString(),
          severity: "high",
          printer: printers[2] ? {
            id: printers[2].id,
            name: printers[2].name,
            location: printers[2].location
          } : undefined,
          isResolved: false
        },
        {
          id: "a8",
          title: "Maintenance needed",
          description: "Printer has reached 100,000 pages and requires maintenance.",
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          severity: "low",
          printer: printers[0] ? {
            id: printers[0].id,
            name: printers[0].name,
            location: printers[0].location
          } : undefined,
          isResolved: false
        }
      ];
      
      setAlerts(mockAlerts);
      // Save the mock alerts to localStorage via apiService
      await apiService.post('alerts', mockAlerts);
    } catch (error) {
      console.error("Error generating mock alerts:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate mock alerts."
      });
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
    
    setFilteredAlerts(result);
  }, [alerts, searchTerm, statusFilter, severityFilter]);
  
  // Resolve alert with persistence
  const resolveAlert = async (alertId: string) => {
    try {
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
    } catch (error) {
      console.error("Error resolving alert:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resolve the alert. Please try again."
      });
    }
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
    resolveAlert,
    refreshAlerts
  };
};
