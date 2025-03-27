
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Printer, Settings, Users as UsersIcon, BarChart2, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const sidebarLinks = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/printers", label: "Printers", icon: Printer },
  { path: "/users", label: "Users", icon: UsersIcon },
  { path: "/analytics", label: "Analytics", icon: BarChart2 },
  { path: "/settings", label: "Settings", icon: Settings },
];

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Set to true by default
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Only close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // Set sidebar state based on screen size on initial load
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Run once on mount
    handleResize();

    // Add listener for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar backdrop for mobile */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-72 bg-white/90 backdrop-blur-lg border-r border-border/40 shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:w-0 lg:opacity-0"
        )}
        animate={{ 
          x: isSidebarOpen ? 0 : -288,
          width: isSidebarOpen ? 288 : 0
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-border/40">
            <Link to="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
              >
                <Printer className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-medium text-primary">PrinterVerse</span>
            </Link>
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-1 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {sidebarLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const IconComponent = link.icon;
                
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconComponent size={18} className={isActive ? "text-primary" : ""}/>
                      </motion.span>
                      <span>{link.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-indicator"
                          className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto p-4 border-t border-border/40">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UsersIcon size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@printerverse.com</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className={cn(
        "relative flex flex-col flex-1 overflow-y-auto transition-all duration-300",
        !isSidebarOpen && "lg:w-full"
      )}>
        {/* Header */}
        <header 
          className={cn(
            "sticky top-0 z-10 w-full bg-background/70 backdrop-blur-lg transition-all duration-200",
            scrolled ? "border-b border-border/40 shadow-sm" : ""
          )}
        >
          <div className="flex items-center justify-between p-4 lg:px-6">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center ml-auto gap-3">
              <button className="relative p-2 rounded-full hover:bg-accent transition-colors">
                <Bell size={18} className="text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UsersIcon size={16} className="text-primary" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
