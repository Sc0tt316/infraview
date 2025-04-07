
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { PrinterData } from '@/types/printers';

interface StatusLevelsProps {
  inkLevel: number;
  paperLevel: number;
}

const StatusLevels: React.FC<StatusLevelsProps> = ({ inkLevel, paperLevel }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Ink Level ({inkLevel}%)</span>
          <span className={inkLevel < 10 ? "text-red-500" : inkLevel < 25 ? "text-amber-500" : ""}>
            {inkLevel < 10 ? "Very Low" : inkLevel < 25 ? "Low" : "OK"}
          </span>
        </div>
        <Progress value={inkLevel} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Paper Level ({paperLevel}%)</span>
          <span className={paperLevel < 10 ? "text-red-500" : paperLevel < 25 ? "text-amber-500" : ""}>
            {paperLevel < 10 ? "Very Low" : paperLevel < 25 ? "Low" : "OK"}
          </span>
        </div>
        <Progress value={paperLevel} className="h-2" />
      </div>
    </div>
  );
};

export default StatusLevels;
