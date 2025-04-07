
import React from 'react';
import ActivityHeader from '@/components/activity/ActivityHeader';
import ActivityContent from '@/components/activity/ActivityContent';
import { useActivityLogs } from '@/hooks/useActivityLogs';

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
