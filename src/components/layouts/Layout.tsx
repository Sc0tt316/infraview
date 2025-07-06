
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import MobileSidebar from '@/components/layouts/MobileSidebar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Always start closed
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Handle route protection - modified to prevent infinite redirects
  useEffect(() => {
    // Only redirect if we know authentication has completed and user is not authenticated
    if (isAuthenticated === false) {
      // Only navigate if not already on the login page
      if (location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Don't render the layout if not authenticated
  if (isAuthenticated === false) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground py-0 mx-0 rounded px-[10px] my-px">
      {/* Desktop Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} user={user} />
      
      {/* Mobile Sidebar - Shown on smaller screens */}
      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} user={user} />
      
      {/* Main Content Area */}
      <div className={cn("flex flex-col min-h-screen transition-all duration-300 ease-in-out bg-background", isSidebarOpen ? "md:pl-64" : "md:pl-20")}>
        {/* Header */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} openMobileSidebar={() => setIsMobileSidebarOpen(true)} />
        
        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
