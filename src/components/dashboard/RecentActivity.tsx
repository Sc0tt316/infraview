
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { PrinterActivity } from '@/types/printers';

interface RecentActivityProps {
  activities: PrinterActivity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <Activity className="h-4 w-4 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id || index} className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>{activity.user || 'System'}</span>
                    <span>•</span>
                    <time dateTime={activity.timestamp}>{formatDate(activity.timestamp)}</time>
                  </div>
                  {activity.details && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {activity.details}
                    </p>
                  )}
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
