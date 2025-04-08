
import React from 'react';
import { format } from 'date-fns';
import { RefreshCw, Printer, Trash, Settings, Activity } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ActivityLogData } from '@/types/analytics';
import { Button } from '@/components/ui/button';

interface ActivityTableProps {
  logs: ActivityLogData[];
  isLoading: boolean;
}

const ActivityTable: React.FC<ActivityTableProps> = ({ logs, isLoading }) => {
  // Get icon for activity type
  const getActivityIcon = (type: string | undefined, action: string | undefined) => {
    const actionLower = action?.toLowerCase() || '';
    
    if (actionLower.includes('delete') || actionLower.includes('deleted')) {
      return <div className="bg-rose-900 rounded-full p-2"><Trash className="h-5 w-5 text-rose-200" /></div>;
    } else if (actionLower.includes('add') || actionLower.includes('added')) {
      return <div className="bg-blue-900 rounded-full p-2"><Printer className="h-5 w-5 text-blue-200" /></div>;
    } else if (actionLower.includes('update') || actionLower.includes('updated')) {
      return <div className="bg-amber-900 rounded-full p-2"><Settings className="h-5 w-5 text-amber-200" /></div>;
    }
    
    return <div className="bg-slate-800 rounded-full p-2"><Activity className="h-5 w-5 text-slate-200" /></div>;
  };

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
    <div className="space-y-4">
      {logs.map((log, index) => (
        <div key={log.id || index} className="flex gap-3 items-start border-b border-gray-800 pb-4 last:border-0">
          {getActivityIcon(log.type, log.action)}
          <div className="flex-1">
            <p className="font-medium">{log.action || "Activity"}</p>
            <p className="text-sm text-muted-foreground">{log.message || log.entityType}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {log.user || 'System'} • {format(new Date(log.timestamp), 'MMM d, h:mm a')}
            </p>
          </div>
        </div>
      ))}
      
      <div className="flex justify-center">
        <Button 
          variant="link" 
          className="text-blue-500"
        >
          View all activity
        </Button>
      </div>
    </div>
  );
};

export default ActivityTable;
