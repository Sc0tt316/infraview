
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsSummaryCards from '@/components/analytics/StatsSummaryCards';
import PrintVolumeChart from '@/components/analytics/PrintVolumeChart';
import DepartmentVolumeChart from '@/components/analytics/DepartmentVolumeChart';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import { DateRange } from 'react-day-picker';
import DateRangePicker from '@/components/analytics/DateRangePicker';

const Analytics = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Fetch analytics data
  const {
    data: analyticsData = { summary: {} },
    isLoading: isLoadingAnalytics,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => analyticsService.getAnalyticsData(),
  });

  // Fetch print volume data
  const {
    data: printVolumeData = [],
    isLoading: isLoadingVolume,
    refetch: refetchVolume,
  } = useQuery({
    queryKey: ['printVolume', dateRange],
    queryFn: () => analyticsService.getPrintVolumeData('7d'),
  });

  // Handle refresh
  const handleRefresh = () => {
    refetchAnalytics();
    refetchVolume();
  };

  // Handle date range apply
  const handleDateRangeApply = () => {
    refetchVolume();
  };

  const isLoading = isLoadingAnalytics || isLoadingVolume;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Monitor your printer usage and performance</p>
        </div>
        
        <div className="flex items-center gap-2">
          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
            onApply={handleDateRangeApply}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
            </div>
          ) : (
            <div className="space-y-6">
              <StatsSummaryCards data={analyticsData.summary} />

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Print Volume Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PrintVolumeChart data={printVolumeData} />
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Department Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DepartmentVolumeChart data={analyticsData.summary.departmentVolume || []} />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed analytics dashboard coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
