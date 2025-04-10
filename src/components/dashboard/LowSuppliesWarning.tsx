
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PrinterData } from '@/services/printer';

interface LowSuppliesWarningProps {
  printers: PrinterData[];
}

const LowSuppliesWarning: React.FC<LowSuppliesWarningProps> = ({ printers = [] }) => {
  // Find printers with low ink or paper
  const printersWithLowSupplies = printers?.filter(
    p => p.inkLevel < 15 || p.paperLevel < 15
  ) || [];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Low Supplies Warning
        </CardTitle>
      </CardHeader>
      <CardContent>
        {printersWithLowSupplies.length > 0 ? (
          <div className="space-y-4">
            {printersWithLowSupplies.map((printer) => (
              <div key={printer.id} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>{printer.name}</span>
                  <span>{printer.location}</span>
                </div>
                
                {printer.inkLevel < 15 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Ink Level</span>
                      <span className="text-red-600 font-medium">{printer.inkLevel}%</span>
                    </div>
                    <Progress value={printer.inkLevel} className="h-2" style={{ '--progress-background': 'rgb(239 68 68)' } as React.CSSProperties} />
                  </div>
                )}
                
                {printer.paperLevel < 15 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Paper Level</span>
                      <span className="text-red-600 font-medium">{printer.paperLevel}%</span>
                    </div>
                    <Progress value={printer.paperLevel} className="h-2" style={{ '--progress-background': 'rgb(239 68 68)' } as React.CSSProperties} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No printers with low supplies</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LowSuppliesWarning;
