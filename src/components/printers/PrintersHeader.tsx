
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, ListFilter, PlusCircle, RefreshCw } from 'lucide-react';

interface PrintersHeaderProps {
  onRefresh: () => void;
  onAddPrinter: () => void;
  toggleViewMode: () => void;
  isGridView: boolean;
  isAdminOrManager: boolean;
}

const PrintersHeader: React.FC<PrintersHeaderProps> = ({
  onRefresh,
  onAddPrinter,
  toggleViewMode,
  isGridView,
  isAdminOrManager
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Printers</h1>
        <p className="text-muted-foreground mt-1">Manage your organization's printers</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        {isAdminOrManager && (
          <Button onClick={onAddPrinter}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Printer
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleViewMode}
        >
          {isGridView ? <ListFilter className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default PrintersHeader;
