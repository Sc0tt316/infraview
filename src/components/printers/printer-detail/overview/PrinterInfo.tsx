import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, MapPin, Building, Wifi, Calendar } from 'lucide-react';
import { PrinterData } from '@/types/printers';

interface PrinterInfoProps {
  printer: PrinterData;
}

const PrinterInfo: React.FC<PrinterInfoProps> = ({ printer }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const infoItems = [
    {
      label: 'Model',
      value: printer.model,
      icon: Info
    },
    {
      label: 'Location',
      value: printer.location,
      icon: MapPin
    },
    {
      label: 'Department',
      value: printer.department || 'N/A',
      icon: Building
    },
    {
      label: 'IP Address',
      value: printer.ipAddress || 'N/A',
      icon: Wifi
    },
    {
      label: 'Serial Number',
      value: printer.serialNumber || 'N/A',
      icon: Info
    },
    {
      label: 'Added Date',
      value: formatDate(printer.addedDate),
      icon: Calendar
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Printer Information
          </div>
          <Badge variant="outline" className={getStatusColor(printer.status)}>
            <span className="capitalize">{printer.status}</span>
            {printer.subStatus && (
              <span className="ml-1 text-xs">({printer.subStatus})</span>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <IconComponent className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrinterInfo;
