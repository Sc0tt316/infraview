
import React, { useState } from 'react';
import { Alert } from '@/types/alerts';
import AlertFilters from '@/components/alerts/AlertFilters';
import AlertDetailsDialog from '@/components/alerts/AlertDetailsDialog';
import AlertsHeader from '@/components/alerts/AlertsHeader';
import AlertsContent from '@/components/alerts/AlertsContent';
import { useAlerts } from '@/hooks/useAlerts';
import { Button } from '@/components/ui/button';
import { CheckCircle, Trash2 } from 'lucide-react';

const Alerts = () => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
  const {
    isLoading,
    filteredAlerts,
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
  } = useAlerts();
  
  // Event handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (status: typeof statusFilter) => {
    setStatusFilter(status);
  };
  
  const handleSeverityFilterChange = (severity: typeof severityFilter) => {
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
    resolveAlert(alertId);
    
    // Close detail dialog if open
    if (showDetailDialog && selectedAlert?.id === alertId) {
      setShowDetailDialog(false);
    }
  };

  const handleClearResolved = () => {
    clearResolvedAlerts();
  };

  const handleResolveAll = () => {
    resolveAllAlerts();
  };
  
  return (
    <div className="space-y-6">
      <AlertsHeader 
        onRefresh={refreshAlerts} 
        isLoading={isLoading} 
      />
      
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <AlertFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          severityFilter={severityFilter}
          onSeverityFilterChange={handleSeverityFilterChange}
        />
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 md:flex-none"
            onClick={handleClearResolved}
            disabled={isLoading || filteredAlerts.filter(a => a.isResolved).length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Resolved
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="flex-1 md:flex-none" 
            onClick={handleResolveAll}
            disabled={isLoading || filteredAlerts.filter(a => !a.isResolved).length === 0}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Resolve All
          </Button>
        </div>
      </div>
      
      <AlertsContent 
        isLoading={isLoading}
        filteredAlerts={filteredAlerts}
        onResolveAlert={handleResolveAlert}
        onViewDetails={handleViewDetails}
      />
      
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
