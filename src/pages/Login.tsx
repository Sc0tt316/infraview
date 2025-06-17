
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/common/Logo';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    login,
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Logo size="lg" />
          <p className="text-slate-600 dark:text-slate-300 mt-3 text-sm">
            Professional Print Management System
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-slate-900 dark:text-white">
              Sign in
            </CardTitle>
            <CardDescription className="text-center text-slate-600 dark:text-slate-300">
              Stay updated on your print infrastructure
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <AlertDescription className="text-red-700 dark:text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="your.email@company.com"
                  className="h-12 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-1 focus:ring-primary"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Password
                  </Label>
                  <a 
                    href="#" 
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Enter your password"
                  className="h-12 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-1 focus:ring-primary"
                  required 
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-base transition-all duration-200 shadow-lg hover:shadow-xl" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="pt-6">
            <div className="text-center text-sm w-full">
              <span className="text-slate-600 dark:text-slate-300">
                New to M-Printer?{' '}
              </span>
              <a 
                href="#" 
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Join now
              </a>
            </div>
          </CardFooter>
        </Card>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6 text-xs text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
              User Agreement
            </a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
              Help Center
            </a>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
            M-Printer Corporation © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
