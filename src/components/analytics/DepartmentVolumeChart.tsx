
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import { BarChart } from '@/components/ui/chart';
import { DepartmentVolume } from '@/types/analytics';
import { supabase } from '@/integrations/supabase/client';

interface DepartmentVolumeChartProps {
  departmentData?: DepartmentVolume[];
  isLoading: boolean;
}

const DepartmentVolumeChart: React.FC<DepartmentVolumeChartProps> = ({
  departmentData: initialDepartmentData,
  isLoading: initialLoading
}) => {
  const [departmentData, setDepartmentData] = useState<DepartmentVolume[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);

  // Fetch department data directly from Supabase
  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        setIsLoading(true);
        
        // Get all printers grouped by department
        const { data: departments, error } = await supabase
          .from('printers')
          .select('department, job_count')
          .not('department', 'is', null);
        
        if (error) {
          console.error("Error fetching department data:", error);
          setDepartmentData([]);
          setIsLoading(false);
          return;
        }
        
        // Group and sum job counts by department
        const departmentMap = new Map<string, number>();
        
        departments.forEach((printer: any) => {
          if (printer.department) {
            const currentVolume = departmentMap.get(printer.department) || 0;
            departmentMap.set(printer.department, currentVolume + (printer.job_count || 0));
          }
        });
        
        // Convert to the format needed by the chart
        const volumeData: DepartmentVolume[] = Array.from(departmentMap.entries()).map(([department, volume]) => ({
          department,
          volume
        }));
        
        setDepartmentData(volumeData);
      } catch (error) {
        console.error("Error in fetchDepartmentData:", error);
        setDepartmentData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDepartmentData();
  }, []);

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : departmentData && departmentData.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
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
        <div className="flex flex-col items-center justify-center h-full text-center">
          <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No department data available</h3>
          <p className="text-muted-foreground mt-1 max-w-md">
            There are no printers assigned to departments yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default DepartmentVolumeChart;
