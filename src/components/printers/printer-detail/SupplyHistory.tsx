
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import LoadingSpinner from './LoadingSpinner';

interface SupplyHistoryProps {
  printerId: string;
}

const SupplyHistory: React.FC<SupplyHistoryProps> = ({ printerId }) => {
  const { data: supplyLogs = [], isLoading, isError } = useQuery({
    queryKey: ['supply-logs', printerId],
    queryFn: () => printerService.getSupplyLogs(printerId),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div className="text-center py-8 text-muted-foreground">Failed to load supply history.</div>;
  }

  if (supplyLogs.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No supply history found for this printer.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supply History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supplyLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                </TableCell>
                <TableCell>{log.type}</TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Progress
                      value={parseInt(log.message.replace(/\D/g, '')) || 0}
                      className="h-2 w-20"
                    />
                    <span>{log.message.replace(/\D/g, '') || 0}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SupplyHistory;
