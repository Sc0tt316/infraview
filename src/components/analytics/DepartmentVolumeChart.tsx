
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '@/components/ui/chart';
import { DepartmentVolume } from '@/types/analytics';

interface DepartmentVolumeChartProps {
  departmentData: DepartmentVolume[] | undefined;
  isLoading: boolean;
}

const DepartmentVolumeChart: React.FC<DepartmentVolumeChartProps> = ({
  departmentData,
  isLoading
}) => {
  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader>
        <CardTitle>Print Volume by Department</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
          </div>
        ) : departmentData && departmentData.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ height: '320px', width: '100%' }}
          >
            <BarChart
              data={departmentData}
              categories={['volume']}
              index="department"
              colors={['#7166F9']}
              valueFormatter={(value) => `${value.toLocaleString()} pages`}
              showAnimation={true}
              className="h-full w-full"
            />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No department data available</h3>
            <p className="text-muted-foreground mt-1 max-w-md">
              There is no print volume data by department available at this time.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DepartmentVolumeChart;
