
import React from 'react';
import { ActivityContent } from '@/components/activity/ActivityContent';
import { ActivityFilters } from '@/components/activity/ActivityFilters';
import { ActivityHeader } from '@/components/activity/ActivityHeader';
import { ActivityTable } from '@/components/activity/ActivityTable';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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

  const getActivityIcon = (type) => {
    // Fix: Use string literals for comparison instead of enums
    if (type === "error" || type === "warning") {
      return <AlertTriangle className="text-amber-500" />;
    }
    // Fix: Use string literals for comparison instead of enums
    if (type === "info" || type === "success") {
      return <RefreshCw className="text-blue-500" />;
    }
    return <RefreshCw className="text-slate-500" />;
  };

  return (
    <div className="space-y-6">
      <ActivityHeader />
      
      <ActivityFilters 
        searchQuery={searchQuery}
        filterType={filterType}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onSortOrderChange={handleSortOrderChange}
        onRefresh={handleRefresh}
      />
      
      <ActivityContent>
        <ActivityTable 
          logs={filteredLogs}
          isLoading={isLoading}
          getActivityIcon={getActivityIcon}
        />
      </ActivityContent>
    </div>
  );
};

export default Activity;
