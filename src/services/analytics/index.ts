
// Export all analytics services from a central file
import { analyticsDataService } from './analyticsDataService';
import { printVolumeService } from './printVolumeService';
import { activityLogService } from './activityLogService';
import { alertService } from './alertService';
import { AnalyticsServiceInterface } from '@/types/analytics';

// Combine all services into a single analyticsService object
export const analyticsService: AnalyticsServiceInterface = {
  ...analyticsDataService,
  ...printVolumeService,
  ...activityLogService,
  ...alertService
};
