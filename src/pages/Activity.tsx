
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';
import ActivityHeader from '@/components/activity/ActivityHeader';
import ActivityFilters from '@/components/activity/ActivityFilters';
import ActivityContent from '@/components/activity/ActivityContent';
import ActivityTable from '@/components/activity/ActivityTable';
import { ActivityLogData } from '@/types/analytics';
import { Printer, Settings, AlertCircle, RefreshCw } from 'lucide-react';

const Activity = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ['activityLogs', filterType, sortBy, sortOrder],
    queryFn: () => analyticsService.getActivityLogs(filterType),
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleSortOrderChange = (value: 'desc' | 'asc') => {
    setSortOrder(value);
  };

  const handleRefresh = () => {
    refetch();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'printer':
        return <Printer className="h-4 w-4" />;
      case 'settings':
        return <Settings className="h-4 w-4" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  const filteredLogs = logs.filter(log => {
    // Filter by search query
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Filter by type
    if (filterType !== 'all' && log.type !== filterType) {
      return false;
    }
    return true;
  });

  // Sort the logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortBy === 'timestamp') {
      return sortOrder === 'desc'
        ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <ActivityHeader onRefresh={handleRefresh} />
      
      <ActivityFilters
        searchQuery={searchQuery}
        filterType={filterType}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onSortOrderChange={handleSortOrderChange}
      />
      
      <ActivityContent 
        logs={sortedLogs}
        isLoading={isLoading}
        searchQuery={searchQuery}
        filterType={filterType}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onSortOrderChange={handleSortOrderChange}
      >
        <ActivityTable 
          logs={sortedLogs} 
          isLoading={isLoading}
        />
      </ActivityContent>
    </div>
  );
};

export default Activity;
