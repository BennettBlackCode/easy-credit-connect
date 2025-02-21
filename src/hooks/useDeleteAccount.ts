
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

      // Call our new function to delete the user completely
      const { error } = await supabase.rpc('delete_user_and_allow_email_reuse', {
        _user_id: session.user.id
      });

      if (error) throw error;

      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted. You can sign up again with the same email if you wish.",
      });

      // Sign out the user
      await supabase.auth.signOut();
      
      // Redirect to home page
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error deleting account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteAccount,
    isDeleting,
  };
};
