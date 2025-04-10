
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/layouts/Layout';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Printers from '@/pages/Printers';
import Users from '@/pages/Users';
import Alerts from '@/pages/Alerts';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="printers" element={<Printers />} />
                <Route path="users" element={<Users />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
