
import React from 'react';
import { PrinterData } from '@/types/printers';

interface SupplyLevelsProps {
  supplies: PrinterData['supplies'];
}

const SupplyLevels: React.FC<SupplyLevelsProps> = ({ supplies }) => {
  // Return empty component since we're removing all supply level elements
  return null;
};

export default SupplyLevels;
