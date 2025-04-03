
import React from 'react';
import { format } from 'date-fns';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { 
  AlertCircle, CheckCircle, Printer, 
  AlertTriangle, Calendar, User
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert } from '@/types/alerts';

interface AlertDetailsDialogProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (alertId: string) => void;
}

const AlertDetailsDialog: React.FC<AlertDetailsDialogProps> = ({
  alert,
  isOpen,
  onClose,
  onResolve
}) => {
  if (!alert) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {alert.isResolved ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
            Alert Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{alert.title}</h3>
              <p className="text-sm text-muted-foreground">
                {alert.description}
              </p>
            </div>
            {renderSeverityBadge(alert.severity)}
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Status
                </p>
                <p className="text-sm font-medium">
                  {alert.isResolved ? 'Resolved' : 'Active'}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Reported
                </p>
                <p className="text-sm font-medium">
                  {format(new Date(alert.timestamp), 'MMM d, yyyy h:mm a')}
                </p>
              </div>

              {alert.printer && (
                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Printer className="h-4 w-4 mr-2" />
                    Printer
                  </p>
                  <p className="text-sm font-medium">
                    {alert.printer.name} ({alert.printer.location})
                  </p>
                </div>
              )}

              {alert.isResolved && (
                <>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Resolved At
                    </p>
                    <p className="text-sm font-medium">
                      {alert.resolvedAt 
                        ? format(new Date(alert.resolvedAt), 'MMM d, yyyy h:mm a')
                        : 'N/A'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Resolved By
                    </p>
                    <p className="text-sm font-medium">
                      {alert.resolvedBy || 'N/A'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {!alert.isResolved && (
            <Button onClick={() => onResolve(alert.id)}>
              Mark as Resolved
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDetailsDialog;
