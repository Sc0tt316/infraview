import React from 'react';
import { Progress } from '@/components/ui/progress';
import { PrinterData } from '@/types/printers';
interface StatusLevelsProps {
  inkLevel: number;
  paperLevel: number;
  status?: 'online' | 'offline' | 'error' | 'maintenance' | 'warning';
  subStatus?: string;
  supplies?: PrinterData['supplies'];
}
const StatusLevels: React.FC<StatusLevelsProps> = ({
  supplies,
  paperLevel
}) => {
  const renderTonerLevels = () => {
    if (supplies) {
      const {
        black,
        cyan,
        magenta,
        yellow
      } = supplies;
      return <div className="space-y-3">
          <h4 className="text-sm font-medium">Toner Levels</h4>
          
          {/* Black Toner */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Black Toner</span>
              <span className={black < 10 ? "text-red-500" : black < 25 ? "text-amber-500" : "text-green-600"}>
                {black}%
              </span>
            </div>
            <Progress value={black} className="h-2" />
          </div>
          
          {/* Color Toners - only show if available */}
          {cyan !== undefined && <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Cyan Toner</span>
                <span className={cyan < 10 ? "text-red-500" : cyan < 25 ? "text-amber-500" : "text-green-600"}>
                  {cyan}%
                </span>
              </div>
              <Progress value={cyan} className="h-2" />
            </div>}
          
          {magenta !== undefined && <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Magenta Toner</span>
                <span className={magenta < 10 ? "text-red-500" : magenta < 25 ? "text-amber-500" : "text-green-600"}>
                  {magenta}%
                </span>
              </div>
              <Progress value={magenta} className="h-2" />
            </div>}
          
          {yellow !== undefined && <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Yellow Toner</span>
                <span className={yellow < 10 ? "text-red-500" : yellow < 25 ? "text-amber-500" : "text-green-600"}>
                  {yellow}%
                </span>
              </div>
              <Progress value={yellow} className="h-2" />
            </div>}
        </div>;
    }
    return null;
  };
  const renderPaperLevel = () => {
    return <div className="space-y-3">
        <h4 className="text-sm font-medium">Paper Level</h4>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Paper Tray</span>
            <span className={paperLevel < 10 ? "text-red-500" : paperLevel < 25 ? "text-amber-500" : "text-green-600"}>
              {paperLevel}%
            </span>
          </div>
          <Progress value={paperLevel} className="h-2" />
        </div>
      </div>;
  };
  return;
};
export default StatusLevels;