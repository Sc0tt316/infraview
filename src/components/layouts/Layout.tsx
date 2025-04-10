import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import MobileSidebar from '@/components/layouts/MobileSidebar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated
  } = useAuth();

  // Handle route protection
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [user, isAuthenticated, navigate]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If still loading authentication or no user, don't render layout yet
  if (!isAuthenticated) {
    return null;
  }
  return <div className="min-h-screen bg-background text-foreground py-0 mx-0 rounded px-[10px] my-px">
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
      
      {/* Toast notifications */}
      <Toaster />
    </div>;
};
export default Layout;