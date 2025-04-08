
import { Alert } from '@/types/alerts';

// Get alert metrics
export const alertService = {
  getAlertMetrics: async (): Promise<{ total: number; active: number; critical: number }> => {
    // Normally would fetch from API
    return {
      total: 8,
      active: 5,
      critical: 2
    };
  }
};
