
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Package } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface SupplyHistoryProps {
  printerId: string;
}

const SupplyHistory: React.FC<SupplyHistoryProps> = ({ printerId }) => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['supplies', printerId],
    queryFn: () => printerService.getPrinterActivity(printerId, { action: 'supply' }),
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading supply history..." />;
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="p-6 text-center border-dashed border-2">
        <Package className="h-12 w-12 mx-auto text-muted-foreground/60 mb-2" />
        <h3 className="text-lg font-medium mb-1">No supply records</h3>
        <p className="text-muted-foreground text-sm">
          This printer has no supply replacement records yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Supply Replacement History</h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Supply Type</TableHead>
            <TableHead>Changed By</TableHead>
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
              <TableCell>{activity.details || 'Supply replacement'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupplyHistory;
