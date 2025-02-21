import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { UserNameDialog } from "@/components/UserNameDialog";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const mode = searchParams.get('mode');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showNameDialog, setShowNameDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Wait a moment for the database triggers to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user exists in our users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError || !userData) {
            console.error('User data fetch error:', userError);
            // Handle new user scenario
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: session.user.id,
                  email: session.user.email,
                  first_name: session.user.user_metadata.full_name?.split(' ')[0] || '',
                  last_name: session.user.user_metadata.full_name?.split(' ').slice(1).join(' ') || '',
                  status: 'Free Tier',
                  subscription_type: 'free',
                  user_name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || ''
                }
              ]);

            if (insertError) {
              console.error('Error inserting user:', insertError);
              throw new Error('Failed to create user account');
            }
          }

          // Navigate after successful auth
          if (productId) {
            navigate('/billing');
          } else {
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Error handling auth change:', error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "There was an error setting up your account. Please try again.",
          });
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, productId, toast]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      console.log('Starting Google sign in process');
      
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });

      if (signInError) throw signInError;

    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        variant: "destructive",
        title: "Google Sign In Failed",
        description: error.message || "Failed to sign in with Google. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error, data } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        
        if (error) throw error;

        if (data?.user && !data.user.email_confirmed_at) {
          toast({
            title: "Email not confirmed",
            description: "Please check your email and confirm your account before signing in. Don't forget to check your spam folder.",
            variant: "destructive",
          });
          return;
        }

        handleSuccessfulAuth(data.user);
      } else {
        const { error, data } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        
        if (error) throw error;

        if (data?.user?.identities?.length === 0) {
          toast({
            variant: "destructive",
            title: "Account already exists",
            description: "An account with this email already exists. Please sign in instead.",
          });
          setIsLogin(true);
          return;
        }

        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account. You'll be redirected to continue.",
        });

        if (data.user) {
          handleSuccessfulAuth(data.user);
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulAuth = async (user: any) => {
    if (!isLogin && !user.app_metadata.provider) {
      setShowNameDialog(true);
    } else {
      if (productId) {
        navigate("/billing");
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303] px-4">
      <div className="w-full max-w-md space-y-8 bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/5">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="mt-2 text-gray-400">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Sign up to get started with our services"}
          </p>
        </div>

        <GoogleSignInButton 
          isLoading={isLoading} 
          onSignIn={handleGoogleSignIn} 
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-white/5" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#030303] px-2 text-gray-400">
              Or continue with email
            </span>
          </div>
        </div>

        <EmailAuthForm
          isLogin={isLogin}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary/90 text-sm"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
      <UserNameDialog 
        open={showNameDialog} 
        onOpenChange={setShowNameDialog}
      />
    </div>
  );
};

export default Auth;
