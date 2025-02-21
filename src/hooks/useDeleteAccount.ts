
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useDeleteAccount = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const deleteAccount = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to delete your account",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDeleting(true);

      // Call edge function to delete user
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId: session.user.id }
      });

      if (error) {
        console.error('Delete account error:', error);
        throw new Error('Failed to delete account. Please try again or contact support.');
      }

      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted. You can sign up again with the same email if you wish.",
      });

      // Sign out and redirect to home page
      await supabase.auth.signOut();
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error deleting account",
        description: error.message,
        variant: "destructive",
      });
      
      // If there was an error, let the user try logging in again
      navigate('/auth');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteAccount,
    isDeleting,
  };
};
