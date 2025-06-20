
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, X, Home, Printer, Users as UsersIcon, 
  BarChart2, LogOut, Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import NotificationDropdown from "./NotificationDropdown";

interface LayoutProps {
  children: React.ReactNode;
}

const sidebarLinks = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/printers", label: "Printers", icon: Printer },
  { path: "/users", label: "Users", icon: UsersIcon },
  { path: "/analytics", label: "Analytics", icon: BarChart2 },
  { path: "/alerts", label: "Alerts", icon: Settings }
];

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

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

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarExpanded(true);
      } else {
        setIsSidebarExpanded(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={cn("flex h-screen overflow-hidden bg-background dark:bg-gray-900")}>
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-r border-border/40 shadow-lg transition-all duration-300 ease-in-out lg:relative lg:shadow-none"
        )}
        animate={{ 
          width: isSidebarExpanded ? 288 : 80
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-border/40">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#300054] flex items-center justify-center rounded-md border border-[#ff6b6b]">
                <img 
                  src="/lovable-uploads/79c40e69-54c0-4cbd-a41c-369e4c8bb316.png" 
                  alt="M-Printer Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <AnimatePresence>
                {isSidebarExpanded && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl font-medium text-primary truncate"
                  >
                    M-Printer
                  </motion.span>
                )}
              </AnimatePresence>
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
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative",
                        isActive 
                          ? "bg-primary/10 text-primary dark:bg-primary/20" 
                          : "text-muted-foreground hover:bg-accent hover:text-foreground dark:hover:bg-gray-800"
                      )}
                    >
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconComponent size={18} className={isActive ? "text-primary" : ""}/>
                      </motion.span>
                      <AnimatePresence>
                        {isSidebarExpanded && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {link.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
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

          <div className="mt-auto p-4 border-t border-border/40 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user?.name || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <AnimatePresence>
                  {isSidebarExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1"
                    >
                      <p className="text-sm font-medium">{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className={cn("flex mt-3", isSidebarExpanded ? "flex-col space-y-2" : "flex-col space-y-2 items-center")}>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-2 rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  isSidebarExpanded ? "px-4 py-2 justify-start" : "p-2 justify-center"
                )}
                onClick={() => navigate('/settings')}
              >
                <Settings size={16} />
                <AnimatePresence>
                  {isSidebarExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Settings
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
                  isSidebarExpanded ? "px-4 py-2 justify-start" : "p-2 justify-center"
                )}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <AnimatePresence>
                  {isSidebarExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Logout
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </motion.aside>

      <div className={cn(
        "relative flex flex-col flex-1 overflow-y-auto transition-all duration-300",
        isSidebarExpanded ? "lg:ml-72" : "lg:ml-20"
      )}>
        <header 
          className={cn(
            "sticky top-0 z-10 w-full bg-background/70 dark:bg-gray-900/70 backdrop-blur-lg transition-all duration-200",
            scrolled ? "border-b border-border/40 dark:border-gray-800/40 shadow-sm" : ""
          )}
        >
          <div className="flex items-center justify-between p-4 lg:px-6">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center gap-3">
              <NotificationDropdown />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'dark' ? 
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg> : 
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
                }
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 dark:bg-gray-900 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
