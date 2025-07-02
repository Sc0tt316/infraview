
import { useState, useEffect } from 'react';
import { mockServers } from '@/services/server/mockServerData';
import { ServerData } from '@/types/servers';

export const useServers = () => {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchServers = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setServers(mockServers);
      setIsLoading(false);
    };

    fetchServers();
  }, []);

  const refetchServers = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setServers([...mockServers]); // Refresh data
    setIsLoading(false);
  };

  return {
    servers,
    isLoading,
    error: null,
    refetch: refetchServers,
    refetchServers
  };
};
