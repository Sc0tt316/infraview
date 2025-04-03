
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'online':
      return <Badge className="bg-green-500">Online</Badge>;
    case 'offline':
      return <Badge variant="outline" className="text-gray-500">Offline</Badge>;
    case 'error':
      return <Badge variant="destructive">Error</Badge>;
    case 'maintenance':
      return <Badge className="bg-blue-500">Maintenance</Badge>;
    case 'warning':
      return <Badge className="bg-amber-500">Warning</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-500 hover:bg-green-600';
    case 'offline':
      return 'bg-gray-500 hover:bg-gray-600';
    case 'error':
      return 'bg-red-500 hover:bg-red-600';
    case 'maintenance':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'warning':
      return 'bg-amber-500 hover:bg-amber-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

export const getActivityIcon = (type: string) => {
  switch (type) {
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};
