
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Printer, AlertTriangle, Settings, Info } from 'lucide-react';
import { PrinterActivity } from '@/types/printers';
import { format, formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  activities: PrinterActivity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities = [] }) => {
  // Get icon based on activity type
  const getActivityIcon = (action: string) => {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('print') || actionLower.includes('job')) {
      return <Printer className="h-4 w-4 text-blue-500" />;
    } else if (actionLower.includes('error') || actionLower.includes('alert') || actionLower.includes('warn')) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    } else if (actionLower.includes('config') || actionLower.includes('set') || actionLower.includes('update')) {
      return <Settings className="h-4 w-4 text-amber-500" />;
    } else {
      return <Info className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Format timestamp to relative time
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };
  
  // Sort activities by timestamp (most recent first) and take the first 5
  const recentActivities = activities && activities.length > 0 
    ? [...activities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
    : [];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="bg-muted h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  {getActivityIcon(activity.action)}
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.details || 'No details available'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No recent activity
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
