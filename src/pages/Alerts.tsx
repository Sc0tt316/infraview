
import React, { useState } from 'react';
import { Alert } from '@/types/alerts';
import AlertFilters from '@/components/alerts/AlertFilters';
import AlertDetailsDialog from '@/components/alerts/AlertDetailsDialog';
import AlertsHeader from '@/components/alerts/AlertsHeader';
import AlertsContent from '@/components/alerts/AlertsContent';
import { useAlerts } from '@/hooks/useAlerts';

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
    refreshAlerts
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
  
  return (
    <div className="space-y-6">
      <AlertsHeader 
        onRefresh={refreshAlerts} 
        isLoading={isLoading} 
      />
      
      <AlertFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        severityFilter={severityFilter}
        onSeverityFilterChange={handleSeverityFilterChange}
      />
      
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
