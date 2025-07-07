
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Database, AlertTriangle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemStatusData {
  printServerStatus: 'online' | 'offline' | 'warning';
  printQueueStatus: 'operational' | 'degraded' | 'offline';
  errorRate: number;
  lastSyncTime: string;
}

const SystemStatus: React.FC = () => {
  const [statusData, setStatusData] = useState<SystemStatusData>({
    printServerStatus: 'online',
    printQueueStatus: 'operational',
    errorRate: 2.3,
    lastSyncTime: new Date().toISOString()
  });
  
  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        // In a real implementation, this would fetch from Supabase or another API
        // const { data, error } = await supabase.from('system_status').select('*').single();
        // if (error) throw error;
        // setStatusData(data);
        
        // For now, we'll just use mock data with the timestamp updated
        setStatusData({
          printServerStatus: 'online',
          printQueueStatus: 'operational',
          errorRate: 2.3,
          lastSyncTime: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error fetching system status:', error);
      }
    };
    
    fetchSystemStatus();
    const intervalId = setInterval(fetchSystemStatus, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const syncTime = new Date(timestamp);
    const diffMs = now.getTime() - syncTime.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className={`h-10 w-10 ${statusData.printServerStatus === 'online' ? 'bg-green-50' : 'bg-red-50'} flex items-center justify-center rounded-full mr-3`}>
              <Activity className={`h-5 w-5 ${statusData.printServerStatus === 'online' ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div>
              <p className="text-sm font-medium">Print Server</p>
              <p className="text-xs text-muted-foreground capitalize">{statusData.printServerStatus}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className={`h-10 w-10 ${statusData.printQueueStatus === 'operational' ? 'bg-green-50' : 'bg-yellow-50'} flex items-center justify-center rounded-full mr-3`}>
              <Database className={`h-5 w-5 ${statusData.printQueueStatus === 'operational' ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
            <div>
              <p className="text-sm font-medium">Print Queue</p>
              <p className="text-xs text-muted-foreground capitalize">{statusData.printQueueStatus}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className={`h-10 w-10 ${statusData.errorRate < 5 ? 'bg-green-50' : 'bg-yellow-50'} flex items-center justify-center rounded-full mr-3`}>
              <AlertTriangle className={`h-5 w-5 ${statusData.errorRate < 5 ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
            <div>
              <p className="text-sm font-medium">Alerts</p>
              <p className="text-xs text-muted-foreground">
                {statusData.errorRate < 5 ? 'Normal' : 'Elevated'} ({statusData.errorRate.toFixed(1)}%)
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-10 w-10 bg-green-50 flex items-center justify-center rounded-full mr-3">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Last Sync</p>
              <p className="text-xs text-muted-foreground">{getTimeAgo(statusData.lastSyncTime)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
