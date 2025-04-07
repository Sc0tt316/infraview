
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';
import { ActivityLogData } from '@/types/analytics';

export const useActivityLogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Get activity logs with parameters
  const getActivityLogsWithParams = async () => {
    return await analyticsService.getActivityLogs({
      limit: 100,
      sortBy,
      sortOrder
    });
  };

  // Fetch activity logs
  const { data: activityLogs, isLoading, refetch } = useQuery({
    queryKey: ['activityLogs', sortBy, sortOrder],
    queryFn: getActivityLogsWithParams
  });

  // Filter logs based on search query and filter type
  const filteredLogs = useMemo(() => {
    if (!activityLogs) return [];

    let filtered = [...activityLogs];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.entityId?.toLowerCase().includes(query) || 
        log.entityType?.toLowerCase().includes(query) || 
        (log.user && log.user.toLowerCase().includes(query)) ||
        log.message?.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.type === filterType);
    }

    return filtered;
  }, [activityLogs, searchQuery, filterType]);

  // Event handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleSortOrderChange = (value: 'asc' | 'desc') => {
    setSortOrder(value);
  };

  const handleRefresh = () => {
    refetch();
  };

  return {
    filteredLogs,
    isLoading,
    searchQuery,
    filterType,
    sortBy,
    sortOrder,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    handleSortOrderChange,
    handleRefresh
  };
};
