
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/types/alerts';

interface AlertsOverviewProps {
  alerts: Alert[];
  onViewAllAlerts: () => void;
}

const AlertsOverview: React.FC<AlertsOverviewProps> = ({ alerts, onViewAllAlerts }) => {
  // Function to get badge for alert severity
  const getSeverityBadge = (severity: string) => {
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
  
  // Filter for only unresolved alerts
  const unresolvedAlerts = alerts.filter(a => !a.isResolved).slice(0, 5);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-gray-900 p-4 border-t border-gray-800">
          {unresolvedAlerts.length > 0 ? (
            <div className="space-y-4">
              {unresolvedAlerts.map((alert) => (
                <div key={alert.id} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{alert.title}</p>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(alert.timestamp), 'MMM d, h:mm a')}
                  </p>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-gray-900 border-gray-700 text-white hover:bg-gray-800" 
                onClick={onViewAllAlerts}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View all alerts
              </Button>
            </div>
          ) : (
            <div className="py-12 text-center">
              <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No active alerts</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={onViewAllAlerts}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View alert history
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsOverview;
