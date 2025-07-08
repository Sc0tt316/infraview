
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, FileText, Zap } from 'lucide-react';
import { SuppliesData } from '@/types/printers';

interface SupplyLevelsProps {
  supplies?: SuppliesData;
}

const SupplyLevels: React.FC<SupplyLevelsProps> = ({ supplies }) => {
  const getSupplyColor = (level: number) => {
    if (level > 50) return 'bg-green-500';
    if (level > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSupplyTextColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!supplies) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Supply Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No supply data available</p>
        </CardContent>
      </Card>
    );
  }

  const supplyItems = [];

  // Add black toner/ink
  if (supplies.black !== undefined) {
    supplyItems.push({
      name: 'Black Toner',
      level: supplies.black,
      icon: Droplets,
      unit: '%'
    });
  }

  // Add color supplies if available
  if (supplies.cyan !== undefined) {
    supplyItems.push({
      name: 'Cyan Toner',
      level: supplies.cyan,
      icon: Droplets,
      unit: '%'
    });
  }

  if (supplies.magenta !== undefined) {
    supplyItems.push({
      name: 'Magenta Toner',
      level: supplies.magenta,
      icon: Droplets,
      unit: '%'
    });
  }

  if (supplies.yellow !== undefined) {
    supplyItems.push({
      name: 'Yellow Toner',
      level: supplies.yellow,
      icon: Droplets,
      unit: '%'
    });
  }

  // Add waste if available
  if (supplies.waste !== undefined) {
    supplyItems.push({
      name: 'Waste Toner',
      level: supplies.waste,
      icon: Zap,
      unit: '%'
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5" />
          Supply Levels
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {supplyItems.map((supply, index) => {
          const IconComponent = supply.icon;
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{supply.name}</span>
                </div>
                <span className={`font-semibold ${getSupplyTextColor(supply.level)}`}>
                  {supply.level}{supply.unit}
                </span>
              </div>
              <Progress 
                value={supply.level} 
                className="h-2"
                indicatorClassName={getSupplyColor(supply.level)}
              />
              <div className="text-xs text-muted-foreground">
                {supply.level > 50 ? 'Good' : supply.level > 20 ? 'Low' : 'Critical'}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SupplyLevels;
