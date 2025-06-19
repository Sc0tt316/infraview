
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PasswordVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  userEmail: string;
}

const PasswordVerificationDialog: React.FC<PasswordVerificationDialogProps> = ({
  isOpen,
  onClose,
  onVerified,
  userEmail
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyPassword = async () => {
    if (!currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    try {
      // Attempt to sign in with the current credentials to verify password
      const { error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword
      });

      if (error) {
        toast({
          title: "Verification Failed",
          description: "Current password is incorrect.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Password Verified",
        description: "You can now proceed with editing the user."
      });
      
      onVerified();
      onClose();
      setCurrentPassword('');
    } catch (error) {
      console.error('Password verification error:', error);
      toast({
        title: "Error",
        description: "Failed to verify password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify Current Password</DialogTitle>
          <DialogDescription>
            Please enter your current password to proceed with editing user information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current-password" className="text-right">
              Current Password
            </Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="col-span-3"
              placeholder="Enter your current password"
              onKeyDown={(e) => e.key === 'Enter' && handleVerifyPassword()}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleVerifyPassword}
            disabled={isVerifying || !currentPassword}
          >
            {isVerifying ? 'Verifying...' : 'Verify Password'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordVerificationDialog;
