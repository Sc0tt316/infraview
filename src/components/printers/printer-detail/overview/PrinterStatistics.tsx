
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, FileText, Clock, TrendingUp } from 'lucide-react';
import { Printer } from '@/types/printer';

interface PrinterStatisticsProps {
  printer: Printer;
}

const PrinterStatistics: React.FC<PrinterStatisticsProps> = ({ printer }) => {
  const getStatValue = (statKey: string, fallback: number = 0) => {
    if (printer.stats && typeof printer.stats === 'object') {
      const stats = printer.stats as any;
      return stats[statKey] || fallback;
    }
    return fallback;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const formatUptime = () => {
    const lastActive = printer.last_active;
    if (!lastActive) return 'Unknown';
    
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffInHours = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const days = Math.floor(diffInHours / 24);
    return `${days} days ago`;
  };

  const statistics = [
    {
      label: 'Total Jobs',
      value: printer.job_count?.toString() || '0',
      icon: FileText,
      description: 'Print jobs processed'
    },
    {
      label: 'Pages Printed',
      value: getStatValue('pages_printed', 0).toString(),
      icon: BarChart,
      description: 'Total pages printed'
    },
    {
      label: 'Last Active',
      value: formatUptime(),
      icon: Clock,
      description: 'Last activity time'
    },
    {
      label: 'Avg Daily Jobs',
      value: getStatValue('avg_daily_jobs', 0).toString(),
      icon: TrendingUp,
      description: 'Average jobs per day'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {statistics.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrinterStatistics;
