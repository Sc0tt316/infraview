
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { UserData } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

export const useUsersRealtime = () => {
  const queryClient = useQueryClient();
  
  // Query to fetch all users
  const { 
    data: users = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers
  });

  // Set up real-time subscription to profiles table
  useEffect(() => {
    // Subscribe to changes in the profiles table
    const channel = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Profiles change detected:', payload);
          // Invalidate and refetch users when profiles change
          queryClient.invalidateQueries({
            queryKey: ['users'],
          });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Helper function to filter users by role
  const filterUsersByRole = (role: string | 'all') => {
    if (role === 'all') return users;
    return users.filter(user => user.role === role);
  };

  // Helper function to search users
  const searchUsers = (query: string, filteredUsers: UserData[]) => {
    if (!query) return filteredUsers;
    
    const lowercaseQuery = query.toLowerCase();
    return filteredUsers.filter(user => 
      user.name?.toLowerCase().includes(lowercaseQuery) || 
      user.email?.toLowerCase().includes(lowercaseQuery) ||
      user.department?.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    users,
    isLoading,
    error,
    refetch,
    filterUsersByRole,
    searchUsers
  };
};
