
import React, { useState } from 'react';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import StatsSummaryCards from '@/components/analytics/StatsSummaryCards';
import PrintVolumeChart from '@/components/analytics/PrintVolumeChart';
import DepartmentVolumeChart from '@/components/analytics/DepartmentVolumeChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Analytics = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date(),
  });

  return (
    <div className="space-y-6">
      <AnalyticsHeader dateRange={dateRange} setDateRange={setDateRange} />
      
      <StatsSummaryCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Print Volume</CardTitle>
            <CardDescription>Daily print volume over selected period</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PrintVolumeChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Department Usage</CardTitle>
            <CardDescription>Print volume by department</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <DepartmentVolumeChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
