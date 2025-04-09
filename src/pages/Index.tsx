
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useAlerts } from '@/hooks/useAlerts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PrinterStatusSummary from '@/components/dashboard/PrinterStatusSummary';
import { usePrinters } from '@/hooks/usePrinters';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { alerts, isLoading: alertsLoading } = useAlerts();
  const { printers, isLoading: printersLoading } = usePrinters();
  
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [printerData, setPrinterData] = useState([]);
  
  // Check if user is admin or manager
  const hasAdminAccess = user?.role === 'admin' || user?.role === 'manager';
  
  useEffect(() => {
    // Sort alerts by timestamp and get the 5 most recent
    if (alerts) {
      const sortedAlerts = [...alerts].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setRecentAlerts(sortedAlerts.slice(0, 5));
    }
  }, [alerts]);
  
  useEffect(() => {
    // Fetch printer data
    if (!printersLoading) {
      setPrinterData(printers);
    }
  }, [printers, printersLoading]);
  
  // Function to determine badge color based on severity
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format alerts data for display
  const alertsData = recentAlerts.map((alert) => ({
    id: alert.id,
    title: alert.title,
    description: alert.description,
    timestamp: alert.timestamp,
    severity: alert.severity,
    isResolved: alert.isResolved,
    resolvedAt: alert.resolvedAt,
    resolvedBy: alert.resolvedBy,
    printer: alert.printer
  }));
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <PrinterStatusSummary printers={printerData} />
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="pl-2 pb-4">
          <ScrollArea className="h-[300px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Severity</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertsData.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{alert.title}</TableCell>
                    <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Button onClick={() => navigate('/printers')}>
              Manage Printers
            </Button>
            {hasAdminAccess && (
              <Button onClick={() => navigate('/users')}>
                Manage Users
              </Button>
            )}
            <Button onClick={() => navigate('/alerts')}>
              View All Alerts
            </Button>
            <Button onClick={() => navigate('/settings')}>
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
