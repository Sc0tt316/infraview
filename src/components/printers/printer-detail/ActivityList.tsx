
import React from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { ActivityItem } from '@/types/printers';
import { getActivityIcon } from './StatusUtils';

interface ActivityListProps {
  activities: ActivityItem[] | undefined;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="py-12 text-center">
        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium">No activity available</h3>
        <p className="text-muted-foreground mt-1">
          There is no activity recorded for this printer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((item, index) => (
        <div key={item.id || index} className="flex items-start border-b border-gray-100 pb-3 last:border-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            {getActivityIcon(item.type)}
          </div>
          <div className="ml-3 flex-grow">
            <div className="flex justify-between">
              <span className="font-medium text-sm">{item.message}</span>
              <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                {format(new Date(item.timestamp), 'MMM d, h:mm a')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
