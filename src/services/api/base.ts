
// Base API service with error handling
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const baseApiService = {
  async get<T>(url: string): Promise<T> {
    try {
      // Simulate network delay
      await delay(800);
      
      // Use localStorage as our "database"
      const data = localStorage.getItem(url);
      if (data) {
        return JSON.parse(data) as T;
      }
      
      // If no data exists yet, return null
      return null as unknown as T;
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
      throw error;
    }
  },
  
  async post<T>(url: string, data: any): Promise<T> {
    try {
      // Simulate network delay
      await delay(800);
      
      // Store in localStorage
      localStorage.setItem(url, JSON.stringify(data));
      return data as T;
    } catch (error) {
      console.error(`Error posting to ${url}:`, error);
      throw error;
    }
  },
  
  async put<T>(url: string, data: any): Promise<T> {
    try {
      // Simulate network delay
      await delay(800);
      
      // Get existing data
      const existingData = localStorage.getItem(url);
      const mergedData = existingData ? { ...JSON.parse(existingData), ...data } : data;
      
      // Store updated data
      localStorage.setItem(url, JSON.stringify(mergedData));
      return mergedData as T;
    } catch (error) {
      console.error(`Error updating ${url}:`, error);
      throw error;
    }
  },
  
  async delete(url: string): Promise<void> {
    try {
      // Simulate network delay
      await delay(800);
      
      // Remove from localStorage
      localStorage.removeItem(url);
    } catch (error) {
      console.error(`Error deleting ${url}:`, error);
      throw error;
    }
  }
};
