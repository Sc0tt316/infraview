
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertSeverity } from '@/types/alerts';
import { useAlerts } from '@/hooks/useAlerts';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import PrinterStatusSummary from '@/components/dashboard/PrinterStatusSummary';
import { usePrinters } from '@/hooks/usePrinters';
import { PrinterData } from '@/types/printers';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { alerts, filteredAlerts, isLoading: alertsLoading } = useAlerts();
  const { printers, isLoading: printersLoading } = usePrinters();
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [printerData, setPrinterData] = useState<PrinterData[]>([]);

  // Check if user is admin
  const hasAdminAccess = user?.role === 'admin' || user?.role === 'manager';

  useEffect(() => {
    // Sort alerts by timestamp and get the 5 most recent
    const sortedAlerts = [...alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setRecentAlerts(sortedAlerts.slice(0, 5));
  }, [alerts]);

  useEffect(() => {
    // Fetch printer data
    if (!printersLoading) {
      setPrinterData(printers);
    }
  }, [printers, printersLoading]);

  // Function to determine badge color based on severity
  const getSeverityColor = (severity: AlertSeverity) => {
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

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Printer Status Summary */}
      <PrinterStatusSummary printers={printerData} />

      {/* Recent Alerts Table */}
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
                {recentAlerts.map((alert) => (
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Button onClick={() => navigate('/printers')}>Manage Printers</Button>
            {hasAdminAccess && (
              <Button onClick={() => navigate('/users')}>Manage Users</Button>
            )}
            <Button onClick={() => navigate('/alerts')}>View All Alerts</Button>
            <Button onClick={() => navigate('/settings')}>Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
