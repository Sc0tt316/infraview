
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface MaintenanceHistoryProps {
  printerId: string;
}

const MaintenanceHistory: React.FC<MaintenanceHistoryProps> = ({ printerId }) => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['maintenance', printerId],
    queryFn: () => printerService.getPrinterActivity(printerId, { action: 'maintenance' }),
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading maintenance history..." />;
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="p-6 text-center border-dashed border-2">
        <Wrench className="h-12 w-12 mx-auto text-muted-foreground/60 mb-2" />
        <h3 className="text-lg font-medium mb-1">No maintenance records</h3>
        <p className="text-muted-foreground text-sm">
          This printer has no maintenance records yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Maintenance Records</h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Performed By</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity, index) => (
            <TableRow key={activity.id || index}>
              <TableCell className="font-mono text-xs">
                {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
              </TableCell>
              <TableCell>{activity.action}</TableCell>
              <TableCell>{activity.user || 'System'}</TableCell>
              <TableCell>{activity.details || 'Routine maintenance'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MaintenanceHistory;
