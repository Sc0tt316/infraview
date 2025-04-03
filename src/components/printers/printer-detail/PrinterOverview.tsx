
import React from 'react';
import { format } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PrinterData } from '@/types/printers';

interface PrinterOverviewProps {
  printer: PrinterData;
  isRestarting: boolean;
  onRestartPrinter: () => void;
}

const PrinterOverview: React.FC<PrinterOverviewProps> = ({
  printer,
  isRestarting,
  onRestartPrinter
}) => {
  return (
    <div className="space-y-6">
      {/* Printer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Printer Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-muted-foreground">Model:</div>
              <div>{printer.model}</div>

              <div className="text-muted-foreground">Location:</div>
              <div>{printer.location}</div>

              <div className="text-muted-foreground">Serial Number:</div>
              <div>{printer.serialNumber || 'N/A'}</div>

              <div className="text-muted-foreground">IP Address:</div>
              <div>{printer.ipAddress || 'N/A'}</div>

              <div className="text-muted-foreground">Department:</div>
              <div>{printer.department || 'N/A'}</div>

              <div className="text-muted-foreground">Date Added:</div>
              <div>{printer.addedDate ? format(new Date(printer.addedDate), 'MMM dd, yyyy') : 'N/A'}</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Supplies</h3>
            {printer.supplies ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Black Toner ({printer.supplies.black}%)</span>
                    <span className={printer.supplies.black < 10 ? "text-red-500" : printer.supplies.black < 25 ? "text-amber-500" : ""}>
                      {printer.supplies.black < 10 ? "Very Low" : printer.supplies.black < 25 ? "Low" : "OK"}
                    </span>
                  </div>
                  <Progress value={printer.supplies.black} className="h-2" />
                </div>

                {printer.supplies.cyan !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cyan Toner ({printer.supplies.cyan}%)</span>
                      <span className={printer.supplies.cyan < 10 ? "text-red-500" : printer.supplies.cyan < 25 ? "text-amber-500" : ""}>
                        {printer.supplies.cyan < 10 ? "Very Low" : printer.supplies.cyan < 25 ? "Low" : "OK"}
                      </span>
                    </div>
                    <Progress value={printer.supplies.cyan} className="h-2" />
                  </div>
                )}

                {printer.supplies.magenta !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Magenta Toner ({printer.supplies.magenta}%)</span>
                      <span className={printer.supplies.magenta < 10 ? "text-red-500" : printer.supplies.magenta < 25 ? "text-amber-500" : ""}>
                        {printer.supplies.magenta < 10 ? "Very Low" : printer.supplies.magenta < 25 ? "Low" : "OK"}
                      </span>
                    </div>
                    <Progress value={printer.supplies.magenta} className="h-2" />
                  </div>
                )}

                {printer.supplies.yellow !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Yellow Toner ({printer.supplies.yellow}%)</span>
                      <span className={printer.supplies.yellow < 10 ? "text-red-500" : printer.supplies.yellow < 25 ? "text-amber-500" : ""}>
                        {printer.supplies.yellow < 10 ? "Very Low" : printer.supplies.yellow < 25 ? "Low" : "OK"}
                      </span>
                    </div>
                    <Progress value={printer.supplies.yellow} className="h-2" />
                  </div>
                )}

                {printer.supplies.waste !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Waste Container ({printer.supplies.waste}%)</span>
                      <span className={printer.supplies.waste > 90 ? "text-red-500" : printer.supplies.waste > 75 ? "text-amber-500" : ""}>
                        {printer.supplies.waste > 90 ? "Nearly Full" : printer.supplies.waste > 75 ? "Getting Full" : "OK"}
                      </span>
                    </div>
                    <Progress value={printer.supplies.waste} className="h-2" />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No supply data available</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Status & Levels</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Ink Level ({printer.inkLevel}%)</span>
                  <span className={printer.inkLevel < 10 ? "text-red-500" : printer.inkLevel < 25 ? "text-amber-500" : ""}>
                    {printer.inkLevel < 10 ? "Very Low" : printer.inkLevel < 25 ? "Low" : "OK"}
                  </span>
                </div>
                <Progress value={printer.inkLevel} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Paper Level ({printer.paperLevel}%)</span>
                  <span className={printer.paperLevel < 10 ? "text-red-500" : printer.paperLevel < 25 ? "text-amber-500" : ""}>
                    {printer.paperLevel < 10 ? "Very Low" : printer.paperLevel < 25 ? "Low" : "OK"}
                  </span>
                </div>
                <Progress value={printer.paperLevel} className="h-2" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Statistics</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-muted-foreground">Total Pages:</div>
              <div>{printer.stats?.totalPages?.toLocaleString() || 'N/A'}</div>

              <div className="text-muted-foreground">Monthly Pages:</div>
              <div>{printer.stats?.monthlyPages?.toLocaleString() || 'N/A'}</div>

              <div className="text-muted-foreground">Paper Jams:</div>
              <div>{printer.stats?.jams || 0} incidents</div>

              <div className="text-muted-foreground">Job Count:</div>
              <div>{printer.jobCount?.toLocaleString() || 0} jobs</div>

              <div className="text-muted-foreground">Last Active:</div>
              <div>{printer.lastActive || 'Unknown'}</div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={onRestartPrinter} 
              disabled={isRestarting || printer.status === 'maintenance'} 
              className="w-full"
            >
              {isRestarting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Restarting...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restart Printer
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrinterOverview;
