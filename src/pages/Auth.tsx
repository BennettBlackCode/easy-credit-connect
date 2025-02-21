
import { useState } from "react";
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

  const handleGoogleSignIn = async () => {
    try {
      const redirectTo = productId 
        ? `${window.location.origin}/billing`
        : `${window.location.origin}/dashboard`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            hd: '*',
            // This ensures we get email provider as well
            scopes: 'email profile',
          },
        },
      });
      
      if (error) throw error;
      
      setIsLoading(true);
      toast({
        title: "Redirecting to Google...",
        description: "Please wait while we redirect you to Google sign in.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign In Failed",
        description: error.message,
      });
      setIsLoading(false);
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
