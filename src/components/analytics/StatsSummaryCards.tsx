
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsData } from '@/types/analytics';

interface StatsSummaryCardsProps {
  analyticsData: AnalyticsData | undefined;
}

const StatsSummaryCards: React.FC<StatsSummaryCardsProps> = ({ analyticsData }) => {
  if (!analyticsData || !analyticsData.summary) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(analyticsData.summary)
        .filter(([key]) => !key.includes('departmentVolume'))
        .map(([key, value]) => (
        <Card key={key} className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {key === 'totalPrinters' ? 'Total Printers' : 
                key === 'activePrinters' ? 'Active Printers' : 
                key === 'totalVolume' ? 'Total Print Volume' : 
                key === 'activeJobs' ? 'Active Print Jobs' : 
                key === 'completedJobs' ? 'Completed Jobs (30d)' : 
                key === 'failedJobs' ? 'Failed Jobs (30d)' : 
                key === 'totalUsers' ? 'Total Users' : key}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typeof value === 'number' && (key.includes('Volume') || key.includes('Jobs')) 
                ? value.toLocaleString() 
                : value.toString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsSummaryCards;
