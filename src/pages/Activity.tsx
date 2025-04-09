
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Search, User, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { analyticsService } from '@/services/analytics';
import ActivityHeader from '@/components/activity/ActivityHeader';
import ActivityContent from '@/components/activity/ActivityContent';

const Activity = () => {
  const {
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
  } = useActivityLogs();

  return (
    <div className="space-y-6">
      <ActivityHeader onRefresh={handleRefresh} />
      
      <ActivityContent
        logs={filteredLogs}
        isLoading={isLoading}
        searchQuery={searchQuery}
        filterType={filterType}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onSortOrderChange={handleSortOrderChange}
      />
    </div>
  );
};

export default Activity;
