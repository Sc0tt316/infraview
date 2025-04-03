
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertFilter, AlertSeverity } from '@/types/alerts';
import AlertFilters from '@/components/alerts/AlertFilters';
import AlertsTable from '@/components/alerts/AlertsTable';
import AlertDetailsDialog from '@/components/alerts/AlertDetailsDialog';
import EmptyAlertState from '@/components/alerts/EmptyAlertState';
import { printerService } from '@/services/printer';
import { useToast } from '@/hooks/use-toast';

const Alerts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AlertFilter>('all');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
  const { toast } = useToast();
  
  // Mock data generation
  useEffect(() => {
    const generateMockAlerts = async () => {
      setIsLoading(true);
      try {
        // Get printers for the mock data
        const printers = await printerService.getAllPrinters();
        
        // Generate mock alerts
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
          }
        ];
        
        setAlerts(mockAlerts);
        setFilteredAlerts(mockAlerts);
      } catch (error) {
        console.error("Error generating mock alerts:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load alerts. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    generateMockAlerts();
  }, [toast]);
  
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
  
  // Event handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (status: AlertFilter) => {
    setStatusFilter(status);
  };
  
  const handleSeverityFilterChange = (severity: AlertSeverity | 'all') => {
    setSeverityFilter(severity);
  };
  
  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setShowDetailDialog(true);
  };
  
  const handleCloseDetails = () => {
    setShowDetailDialog(false);
  };
  
  const handleResolveAlert = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId
          ? {
              ...alert,
              isResolved: true,
              resolvedAt: new Date().toISOString(),
              resolvedBy: "Admin User"
            }
          : alert
      )
    );
    
    toast({
      title: "Alert Resolved",
      description: "The alert has been marked as resolved."
    });
    
    // Close detail dialog if open
    if (showDetailDialog && selectedAlert?.id === alertId) {
      setShowDetailDialog(false);
    }
  };
  
  const handleRefresh = () => {
    // In a real app, this would refetch the alerts
    toast({
      title: "Refreshed",
      description: "Alert data has been refreshed."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Alerts</h1>
          <p className="text-muted-foreground mt-1">
            View and manage system alerts
          </p>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <AlertFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        severityFilter={severityFilter}
        onSeverityFilterChange={handleSeverityFilterChange}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : filteredAlerts.length > 0 ? (
        <AlertsTable
          alerts={filteredAlerts}
          onResolveAlert={handleResolveAlert}
          onViewDetails={handleViewDetails}
        />
      ) : (
        <EmptyAlertState />
      )}
      
      <AlertDetailsDialog
        alert={selectedAlert}
        isOpen={showDetailDialog}
        onClose={handleCloseDetails}
        onResolve={handleResolveAlert}
      />
    </div>
  );
};

export default Alerts;
