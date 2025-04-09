
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DateRangePicker from '@/components/analytics/DateRangePicker';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsSummaryCards from '@/components/analytics/StatsSummaryCards';
import PrintVolumeChart from '@/components/analytics/PrintVolumeChart';
import DepartmentVolumeChart from '@/components/analytics/DepartmentVolumeChart';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import { DateRange } from 'react-day-picker';

const Analytics = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Fetch analytics data
  const {
    data: analyticsData,
    isLoading: isLoadingAnalytics,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => analyticsService.getAnalyticsData(),
  });

  // Fetch print volume data
  const {
    data: printVolumeData,
    isLoading: isLoadingVolume,
    refetch: refetchVolume,
  } = useQuery({
    queryKey: ['printVolume', dateRange],
    queryFn: () => analyticsService.getPrintVolumeData('30d'),
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
        <AnalyticsHeader 
          dateRange={dateRange}
          setDateRange={setDateRange}
          onDateRangeApply={handleDateRangeApply}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />
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
              <StatsSummaryCards analyticsData={analyticsData} />

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Print Volume Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PrintVolumeChart 
                      timeRange="month"
                      setTimeRange={() => {}}
                      volumeData={printVolumeData}
                      isLoading={isLoadingVolume}
                    />
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Department Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DepartmentVolumeChart 
                      departmentData={analyticsData?.summary?.departmentVolume}
                      isLoading={isLoadingAnalytics}
                    />
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
