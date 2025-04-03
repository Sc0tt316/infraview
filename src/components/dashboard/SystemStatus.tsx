
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, RefreshCw, Ban, RotateCw } from 'lucide-react';

const SystemStatus: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-green-50 flex items-center justify-center rounded-full mr-3">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Print Server</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-10 w-10 bg-green-50 flex items-center justify-center rounded-full mr-3">
              <RefreshCw className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Print Queue</p>
              <p className="text-xs text-muted-foreground">Operational</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-10 w-10 bg-green-50 flex items-center justify-center rounded-full mr-3">
              <Ban className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Error Rate</p>
              <p className="text-xs text-muted-foreground">Normal (2.3%)</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-10 w-10 bg-green-50 flex items-center justify-center rounded-full mr-3">
              <RotateCw className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Last Sync</p>
              <p className="text-xs text-muted-foreground">5 minutes ago</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
