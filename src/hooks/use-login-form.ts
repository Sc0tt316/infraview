
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCookie, setCookie } from '@/lib/cookie';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    // Initialize from cookie if available and consent was given
    const consentStatus = getCookie('cookie-consent');
    if (consentStatus === 'accepted') {
      return getCookie('auth-remember') === 'true';
    }
    return false;
  });
  
  const { login } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Pass email and password to login function
      const success = await login(email, password);
      
      if (!success) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive"
        });
      } else {
        // If login is successful and remember me is checked, store it in cookie if consent is given
        if (rememberMe) {
          const consentStatus = getCookie('cookie-consent');
          if (consentStatus === 'accepted') {
            setCookie('auth-remember', 'true', 30); // Setting cookie to expire in 30 days
          }
        }
        
        toast({
          title: "Login Successful",
          description: "Welcome back!"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    handleSubmit
  };
};
