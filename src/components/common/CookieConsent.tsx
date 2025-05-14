
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  setCookie,
  getCookie,
  removeCookie
} from '@/lib/cookie';

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if the user has already set cookie preferences
    const hasConsent = getCookie('cookie-consent');
    if (!hasConsent) {
      // Give a small delay before showing the consent banner
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const acceptCookies = () => {
    setCookie('cookie-consent', 'accepted', 365); // Valid for 1 year
    setShowConsent(false);
  };
  
  const denyCookies = () => {
    setCookie('cookie-consent', 'denied', 7); // Only remember for 7 days if denied
    setShowConsent(false);
  };
  
  if (!showConsent) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t border-border shadow-lg animate-fade-in">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-medium mb-1">We use cookies</h3>
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={denyCookies}>
            Deny
          </Button>
          <Button size="sm" onClick={acceptCookies}>
            Accept
          </Button>
          <button 
            onClick={() => setShowConsent(false)} 
            className="p-1 hover:bg-muted rounded-full"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
