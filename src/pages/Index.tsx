
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MainDashboard from '@/components/dashboard/MainDashboard';

/**
 * Index page that serves as the main dashboard
 */
const Index: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect based on user role
  useEffect(() => {
    if (user && user.role === 'user') {
      navigate('/printers');
    }
  }, [user, navigate]);

  return <MainDashboard />;
};

export default Index;
