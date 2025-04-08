
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import LoadingSpinner from './LoadingSpinner';

interface MaintenanceHistoryProps {
  printerId: string;
}

const MaintenanceHistory: React.FC<MaintenanceHistoryProps> = ({ printerId }) => {
  const { data: maintenanceLogs = [], isLoading, isError } = useQuery({
    queryKey: ['maintenance-logs', printerId],
    queryFn: () => printerService.getMaintenanceLogs(printerId),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div className="text-center py-8 text-muted-foreground">Failed to load maintenance history.</div>;
  }

  if (maintenanceLogs.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No maintenance history found for this printer.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenanceLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                </TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>{log.type}</TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell>
                  <Badge variant={log.type === 'scheduled' ? 'outline' : 'default'}>
                    {log.type === 'emergency' ? 'Emergency' : 'Scheduled'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MaintenanceHistory;
