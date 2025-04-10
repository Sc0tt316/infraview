
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { PrinterData } from '@/types/printers';

interface SupplyLevelsProps {
  supplies: PrinterData['supplies'];
}

const SupplyLevels: React.FC<SupplyLevelsProps> = ({ supplies }) => {
  if (!supplies) {
    return (
      <div className="text-sm text-muted-foreground">No supply data available</div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Black Toner */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Black Toner ({supplies.black}%)</span>
          <span className={supplies.black < 10 ? "text-red-500" : supplies.black < 25 ? "text-amber-500" : ""}>
            {supplies.black < 10 ? "Very Low" : supplies.black < 25 ? "Low" : "OK"}
          </span>
        </div>
        <Progress value={supplies.black} className="h-2" />
      </div>

      {/* Cyan Toner - Optional */}
      {supplies.cyan !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Cyan Toner ({supplies.cyan}%)</span>
            <span className={supplies.cyan < 10 ? "text-red-500" : supplies.cyan < 25 ? "text-amber-500" : ""}>
              {supplies.cyan < 10 ? "Very Low" : supplies.cyan < 25 ? "Low" : "OK"}
            </span>
          </div>
          <Progress value={supplies.cyan} className="h-2" />
        </div>
      )}

      {/* Magenta Toner - Optional */}
      {supplies.magenta !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Magenta Toner ({supplies.magenta}%)</span>
            <span className={supplies.magenta < 10 ? "text-red-500" : supplies.magenta < 25 ? "text-amber-500" : ""}>
              {supplies.magenta < 10 ? "Very Low" : supplies.magenta < 25 ? "Low" : "OK"}
            </span>
          </div>
          <Progress value={supplies.magenta} className="h-2" />
        </div>
      )}

      {/* Yellow Toner - Optional */}
      {supplies.yellow !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Yellow Toner ({supplies.yellow}%)</span>
            <span className={supplies.yellow < 10 ? "text-red-500" : supplies.yellow < 25 ? "text-amber-500" : ""}>
              {supplies.yellow < 10 ? "Very Low" : supplies.yellow < 25 ? "Low" : "OK"}
            </span>
          </div>
          <Progress value={supplies.yellow} className="h-2" />
        </div>
      )}

      {/* Waste Container - Optional */}
      {supplies.waste !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Waste Container ({supplies.waste}%)</span>
            <span className={supplies.waste > 90 ? "text-red-500" : supplies.waste > 75 ? "text-amber-500" : ""}>
              {supplies.waste > 90 ? "Nearly Full" : supplies.waste > 75 ? "Getting Full" : "OK"}
            </span>
          </div>
          <Progress value={supplies.waste} className="h-2" />
        </div>
      )}
    </div>
  );
};

export default SupplyLevels;
