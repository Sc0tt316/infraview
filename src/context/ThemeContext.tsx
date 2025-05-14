
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, setCookie } from '@/lib/cookie';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light'); // Default to light theme
  const [isInitialized, setIsInitialized] = useState(false);

  // Load theme on mount
  useEffect(() => {
    // First check if the user has a theme preference saved in a cookie
    const cookieTheme = getCookie('theme') as Theme | null;
    
    // Then check for system preference if no cookie
    if (cookieTheme) {
      setTheme(cookieTheme);
      applyTheme(cookieTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'dark' : 'light';
      setTheme(defaultTheme);
      applyTheme(defaultTheme);
    }
    
    setIsInitialized(true);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    
    // Save user preference in a cookie
    const consentStatus = getCookie('cookie-consent');
    if (consentStatus === 'accepted') {
      setCookie('theme', newTheme, 365);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {isInitialized ? children : null}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
