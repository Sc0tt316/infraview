
import React from 'react';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert } from '@/types/alerts';

interface AlertsTableProps {
  alerts: Alert[];
  onResolveAlert: (alertId: string) => void;
  onViewDetails: (alert: Alert) => void;
}

const AlertsTable: React.FC<AlertsTableProps> = ({
  alerts,
  onResolveAlert,
  onViewDetails
}) => {
  // Function to render severity badge
  const renderSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Badge className="bg-blue-500">Low</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">Medium</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Alert</TableHead>
            <TableHead>Printer</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>
                  {alert.isResolved ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                      <span className="text-sm text-muted-foreground">Resolved</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-1.5" />
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{renderSeverityBadge(alert.severity)}</TableCell>
                <TableCell>
                  <div className="font-medium">{alert.title}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-xs">
                    {alert.description}
                  </div>
                </TableCell>
                <TableCell>
                  {alert.printer ? (
                    <div>
                      <div className="font-medium">{alert.printer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {alert.printer.location}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">System</span>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(alert.timestamp), 'MMM d, h:mm a')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(alert)}
                    >
                      Details
                    </Button>
                    {!alert.isResolved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onResolveAlert(alert.id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No alerts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AlertsTable;
