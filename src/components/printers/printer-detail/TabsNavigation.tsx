
import React from 'react';
import { Printer, FileText } from 'lucide-react';

interface TabsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Printer },
    { id: 'logs', label: 'Print Logs', icon: FileText },
  ];

  return (
    <div className="flex border-b">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center px-6 py-3 text-sm font-medium
              ${isActive ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}
              transition-colors
            `}
          >
            <Icon className="mr-2 h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabsNavigation;
