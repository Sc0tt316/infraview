
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
import { useAuth } from '@/context/AuthContext';

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
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  // Function to determine source type badge
  const renderSourceBadge = (alert: Alert) => {
    if (alert.printer) {
      return <Badge className="bg-blue-500">Printer</Badge>;
    } else if (alert.user) {
      return <Badge className="bg-purple-500">User</Badge>;
    } else {
      return <Badge variant="outline">System</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Alert</TableHead>
            <TableHead>Affected</TableHead>
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
                <TableCell>{renderSourceBadge(alert)}</TableCell>
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
                  ) : alert.user ? (
                    <div>
                      <div className="font-medium">{alert.user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {alert.user.email}
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
                    {!alert.isResolved && isAdmin && (
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
