
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Trash, Printer, Settings, ExternalLink } from 'lucide-react';
import { PrinterActivity } from '@/types/printers';
import { Button } from '@/components/ui/button';

interface RecentActivityProps {
  activities: PrinterActivity[];
  onViewAllActivity: () => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, onViewAllActivity }) => {
  // Function to get icon for activity type
  const getActivityIcon = (type: string | undefined) => {
    switch (type?.toLowerCase()) {
      case 'delete':
      case 'deleted':
        return <div className="bg-rose-900 rounded-full p-2"><Trash className="h-5 w-5 text-rose-200" /></div>;
      case 'add':
      case 'added':
        return <div className="bg-blue-900 rounded-full p-2"><Printer className="h-5 w-5 text-blue-200" /></div>;
      case 'update':
      case 'updated':
        return <div className="bg-amber-900 rounded-full p-2"><Settings className="h-5 w-5 text-amber-200" /></div>;
      default:
        return <div className="bg-slate-800 rounded-full p-2"><Activity className="h-5 w-5 text-slate-200" /></div>;
    }
  };

  // Function to get user display
  const getUserDisplay = (user: string) => {
    return user || 'System';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center">
          <Activity className="h-4 w-4 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-gray-900 p-4 border-t border-gray-800">
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={activity.id || index} className="flex gap-3 items-start">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getUserDisplay(activity.user || '')} • {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="link" 
                className="w-full justify-center text-blue-500 mt-2" 
                onClick={onViewAllActivity}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View all activity
              </Button>
            </div>
          ) : (
            <div className="py-8 text-center">
              <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No recent activity</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={onViewAllActivity}
              >
                View all activity
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
