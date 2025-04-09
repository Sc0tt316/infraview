
import React from 'react';
import { format } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ActivityLogData } from '@/types/analytics';

interface ActivityTableProps {
  logs: ActivityLogData[];
  isLoading: boolean;
}

const ActivityTable: React.FC<ActivityTableProps> = ({ logs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No activity logs found.</p>
      </div>
    );
  }

  // Helper function to get badge variant based on activity type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'outline';
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => (
            <TableRow key={log.id || index}>
              <TableCell className="font-medium">
                {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
              </TableCell>
              <TableCell>{log.action || log.message || log.entityType}</TableCell>
              <TableCell>
                {log.entityId ? (
                  <Badge variant="outline" className="whitespace-nowrap">
                    {log.entityType} #{log.entityId}
                  </Badge>
                ) : log.entityType}
              </TableCell>
              <TableCell>{log.user || 'System'}</TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(log.type)}>
                  {log.type}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActivityTable;
