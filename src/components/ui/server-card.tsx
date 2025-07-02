
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerData } from '@/types/servers';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Server, Cpu, HardDrive, MemoryStick } from "lucide-react";

interface ServerCardProps {
  server: ServerData;
  onOpenDetails: (id: string) => void;
  isAdmin: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'online':
      return <Badge className="bg-green-500">Online</Badge>;
    case 'offline':
      return <Badge variant="outline" className="text-gray-500 border-gray-300">Offline</Badge>;
    case 'error':
      return <Badge variant="destructive">Error</Badge>;
    case 'maintenance':
      return <Badge className="bg-orange-500">Maintenance</Badge>;
    case 'warning':
      return <Badge className="bg-yellow-500">Warning</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const ServerCard: React.FC<ServerCardProps> = ({ 
  server, 
  onOpenDetails, 
  isAdmin 
}) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={() => onOpenDetails(server.id)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg font-bold">{server.name}</CardTitle>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                {server.serverType}
                <span className="mx-2">•</span>
                {server.location}
              </div>
            </div>
          </div>
          {getStatusBadge(server.status)}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs">
                <Cpu className="h-3 w-3" />
                <span>CPU</span>
              </div>
              <Progress 
                value={server.cpuUsage} 
                className="h-2" 
                indicatorClassName={
                  server.cpuUsage > 90 ? "bg-red-500" : 
                  server.cpuUsage > 70 ? "bg-yellow-500" : "bg-green-500"
                } 
              />
              <div className="text-xs text-muted-foreground">{server.cpuUsage}%</div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs">
                <MemoryStick className="h-3 w-3" />
                <span>Memory</span>
              </div>
              <Progress 
                value={server.memoryUsage} 
                className="h-2" 
                indicatorClassName={
                  server.memoryUsage > 90 ? "bg-red-500" : 
                  server.memoryUsage > 70 ? "bg-yellow-500" : "bg-green-500"
                } 
              />
              <div className="text-xs text-muted-foreground">{server.memoryUsage}%</div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs">
                <HardDrive className="h-3 w-3" />
                <span>Disk</span>
              </div>
              <Progress 
                value={server.diskUsage} 
                className="h-2" 
                indicatorClassName={
                  server.diskUsage > 90 ? "bg-red-500" : 
                  server.diskUsage > 70 ? "bg-yellow-500" : "bg-green-500"
                } 
              />
              <div className="text-xs text-muted-foreground">{server.diskUsage}%</div>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Uptime</span>
              <span className="font-medium">{server.uptime}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">OS</span>
              <span className="font-medium">{server.operatingSystem}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
