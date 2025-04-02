
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Printer } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Form schema validation
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      navigate("/");
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left column - Login form */}
      <div className="flex items-center justify-center p-8 md:p-12 bg-background dark:bg-gray-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-12 w-12 bg-[#300054] flex items-center justify-center rounded-md border border-[#ff6b6b] mb-4">
              <img 
                src="/lovable-uploads/79c40e69-54c0-4cbd-a41c-369e4c8bb316.png" 
                alt="M-Printer Manager Logo" 
                className="h-10 w-10 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold">Welcome to M-Printer Manager</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        {...field} 
                        className="dark:bg-gray-800 dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        {...field} 
                        className="dark:bg-gray-800 dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Demo credentials: <span className="font-semibold">admin@printerverse.com / admin123</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right column - Welcome graphic */}
      <div className="hidden md:flex md:items-center md:justify-center bg-primary/10 dark:bg-gray-800 p-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-lg text-center"
        >
          <div className="mb-8 mx-auto">
            <div className="relative flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.6
                }}
                className="w-36 h-36 bg-[#300054] rounded-full flex items-center justify-center"
              >
                <img 
                  src="/lovable-uploads/79c40e69-54c0-4cbd-a41c-369e4c8bb316.png" 
                  alt="M-Printer Manager" 
                  className="w-28 h-28 object-contain"
                />
              </motion.div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Printer Management Made Simple</h2>
          <p className="text-lg text-muted-foreground">
            Effortlessly monitor and manage all your network printers from a 
            single dashboard with real-time alerts and insights.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
