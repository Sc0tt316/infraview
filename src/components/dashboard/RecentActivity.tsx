
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ActivityIcon, AlertTriangle, CheckCircle, Info, 
  Printer, RefreshCw, WrenchIcon, Settings, ShieldAlert 
} from 'lucide-react';
import { PrinterActivity } from '@/services/printer';

interface RecentActivityProps {
  activities: PrinterActivity[];
  onViewAllActivity: () => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, onViewAllActivity }) => {
  // Function to get icon based on activity action
  const getActivityIcon = (action: string) => {
    if (action.includes('added') || action.includes('created'))
      return <Printer className="h-4 w-4 text-blue-500" />;
    if (action.includes('updated') || action.includes('changed') || action.includes('edited'))
      return <Settings className="h-4 w-4 text-amber-500" />;
    if (action.includes('deleted') || action.includes('removed'))
      return <ShieldAlert className="h-4 w-4 text-red-500" />;
    if (action.includes('restarted'))
      return <RefreshCw className="h-4 w-4 text-green-500" />;
    if (action.includes('error'))
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (action.includes('maintenance'))
      return <WrenchIcon className="h-4 w-4 text-blue-500" />;
    
    return <Info className="h-4 w-4 text-gray-500" />;
  };
  
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <ActivityIcon className="h-4 w-4 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            <>
              {activities.map((activity) => (
                <div key={activity.id} className="flex">
                  <div className="mr-4 flex items-start pt-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {getActivityIcon(activity.action)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.details}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <span>{activity.user || 'System'}</span>
                      <span className="mx-1">•</span>
                      <span>{format(new Date(activity.timestamp), 'MMM d, h:mm a')}</span>
                    </p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="py-8 text-center">
              <Info className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          )}
          
          <button 
            onClick={onViewAllActivity}
            className="w-full mt-2 text-sm text-primary hover:underline text-center"
          >
            View all activity
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
