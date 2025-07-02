
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Printers from "./pages/Printers";
import PrinterDetail from "./pages/PrinterDetail";
import Servers from "./pages/Servers";
import Users from "./pages/Users";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/printers"
                    element={
                      <ProtectedRoute>
                        <Printers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/printers/:id"
                    element={
                      <ProtectedRoute>
                        <PrinterDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/servers"
                    element={
                      <ProtectedRoute>
                        <Servers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute>
                        <Users />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/alerts"
                    element={
                      <ProtectedRoute>
                        <Alerts />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/activity"
                    element={
                      <ProtectedRoute>
                        <Activity />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Toaster />
            </div>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
