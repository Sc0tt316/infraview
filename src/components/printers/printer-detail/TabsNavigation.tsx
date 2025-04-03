
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabsNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="px-6">
      <TabsList className="w-full">
        <TabsTrigger 
          value="overview" 
          className="flex-1"
          onClick={() => onTabChange('overview')}
        >
          Overview
        </TabsTrigger>
        <TabsTrigger 
          value="logs" 
          className="flex-1"
          onClick={() => onTabChange('logs')}
        >
          Print Logs
        </TabsTrigger>
        <TabsTrigger 
          value="activity" 
          className="flex-1"
          onClick={() => onTabChange('activity')}
        >
          Activity
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default TabsNavigation;
