
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const deleteAccount = async () => {
    try {
      const { error: deleteError } = await supabase.functions.invoke('delete-user');

      if (deleteError) {
        throw deleteError;
      }

      // Sign out the user after successful deletion
      await supabase.auth.signOut();
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { deleteAccount };
};
