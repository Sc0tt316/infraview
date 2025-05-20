
import { useEffect } from 'react';
import { getCookie, setCookie, removeCookie, ensureCookieConsent } from '@/lib/cookie';

interface AuthPersistenceOptions {
  isAuthenticated: boolean;
  user: any; // Replace with your user type
  rememberMe: boolean;
  onRestoreSession: (user: any) => void;
}

export const useAuthPersistence = ({
  isAuthenticated,
  user,
  rememberMe,
  onRestoreSession
}: AuthPersistenceOptions) => {
  // Save authentication state when it changes
  useEffect(() => {
    // Ensure cookie consent is set to accepted automatically
    ensureCookieConsent();
    
    if (isAuthenticated && user && rememberMe) {
      const userData = JSON.stringify(user);
      setCookie('auth-user', userData, 30); // 30 days
      setCookie('auth-remember', 'true', 30);
    } else if (!isAuthenticated) {
      // Clear auth cookies on logout
      removeCookie('auth-user');
      removeCookie('auth-remember');
    }
  }, [isAuthenticated, user, rememberMe]);
  
  // Try to restore session on mount
  useEffect(() => {
    if (isAuthenticated) return;
    
    // Ensure cookie consent is set to accepted automatically
    ensureCookieConsent();
    
    const rememberedUser = getCookie('auth-user');
    const shouldRemember = getCookie('auth-remember') === 'true';
    
    if (rememberedUser && shouldRemember) {
      try {
        const userData = JSON.parse(rememberedUser);
        onRestoreSession(userData);
      } catch (error) {
        console.error('Failed to restore auth session:', error);
        // Clean up invalid cookies
        removeCookie('auth-user');
        removeCookie('auth-remember');
      }
    }
  }, [isAuthenticated, onRestoreSession]);
  
  return null;
};
