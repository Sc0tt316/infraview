
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, FileText, Zap } from 'lucide-react';
import { Printer } from '@/types/printer';

interface SupplyLevelsProps {
  printer: Printer;
}

const SupplyLevels: React.FC<SupplyLevelsProps> = ({ printer }) => {
  const getSupplyLevel = (supplyType: string) => {
    if (printer.supplies && typeof printer.supplies === 'object') {
      const supplies = printer.supplies as any;
      return supplies[supplyType] || 0;
    }
    // Fallback to individual fields
    switch (supplyType) {
      case 'ink':
      case 'toner':
        return printer.ink_level || 0;
      case 'paper':
        return printer.paper_level || 0;
      default:
        return 0;
    }
  };

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

  const supplies = [
    {
      name: 'Ink/Toner',
      level: getSupplyLevel('ink') || getSupplyLevel('toner'),
      icon: Droplets,
      unit: '%'
    },
    {
      name: 'Paper',
      level: getSupplyLevel('paper'),
      icon: FileText,
      unit: '%'
    }
  ];

  // Add additional supplies if they exist in the supplies object
  if (printer.supplies && typeof printer.supplies === 'object') {
    const suppliesObj = printer.supplies as any;
    Object.keys(suppliesObj).forEach(key => {
      if (!['ink', 'toner', 'paper'].includes(key.toLowerCase())) {
        supplies.push({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          level: suppliesObj[key] || 0,
          icon: Zap,
          unit: '%'
        });
      }
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
        {supplies.map((supply, index) => {
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
