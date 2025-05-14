
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import StatsSummaryCards from '@/components/analytics/StatsSummaryCards';
import PrintVolumeChart from '@/components/analytics/PrintVolumeChart';
import DepartmentVolumeChart from '@/components/analytics/DepartmentVolumeChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';

const Analytics = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date(),
  });
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch analytics data
  const { data: analyticsData, isLoading: isAnalyticsLoading, refetch: refetchAnalytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => analyticsService.getAnalyticsData(),
  });

  // Fetch print volume data based on date range or time range
  const { data: volumeData, isLoading: isVolumeLoading, refetch: refetchVolume } = useQuery({
    queryKey: ['printVolume', timeRange, dateRange],
    queryFn: () => {
      if (timeRange === 'custom' && dateRange?.from && dateRange?.to) {
        return analyticsService.getPrintVolumeByDateRange({
          from: dateRange.from,
          to: dateRange.to,
        });
      } else {
        return analyticsService.getPrintVolumeByTimeRange(timeRange);
      }
    },
  });
  
  // Handle date range apply
  const handleDateRangeApply = () => {
    setTimeRange('custom');
    refetchVolume();
  };
  
  // Handle refresh of all analytics data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchAnalytics(), refetchVolume()]);
      toast({
        title: 'Analytics Refreshed',
        description: 'All analytics data has been updated.',
      });
    } catch (error) {
      console.error('Error refreshing analytics:', error);
      toast({
        variant: 'destructive',
        title: 'Refresh Failed',
        description: 'Failed to refresh analytics data.',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <AnalyticsHeader 
        dateRange={dateRange} 
        setDateRange={setDateRange} 
        onDateRangeApply={handleDateRangeApply}
        onRefresh={handleRefresh}
        isLoading={isRefreshing}
      />
      
      <StatsSummaryCards analyticsData={analyticsData} />
      
      {/* Vertical layout for charts */}
      <div className="space-y-6">
        {/* Department Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Department Usage</CardTitle>
            <CardDescription>Print volume by department</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <DepartmentVolumeChart 
              departmentData={analyticsData?.departmentVolume} 
              isLoading={isAnalyticsLoading} 
            />
          </CardContent>
        </Card>
        
        {/* Print Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Print Volume</CardTitle>
            <CardDescription>Daily print volume over selected period</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <PrintVolumeChart 
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              volumeData={volumeData}
              isLoading={isVolumeLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
