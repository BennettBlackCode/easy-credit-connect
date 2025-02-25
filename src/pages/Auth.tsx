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
  const loginParam = searchParams.get('isLogin');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(loginParam === 'false' ? false : true);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (loginParam) {
      window.history.replaceState(null, '', '/auth');
    }
  }, [loginParam]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && session.user.email_confirmed_at) {
        await grantFreeTier(session.user.id);
        navigate(productId ? '/billing' : '/dashboard');
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user && session.user.email_confirmed_at) {
        await grantFreeTier(session.user.id);
        navigate(productId ? '/billing' : '/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, productId]);

  const grantFreeTier = async (userId) => {
    const { error } = await supabase.rpc('grant_free_tier', { user_id: userId });
    if (error) {
      console.error('Grant free tier error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to assign free tier: ${error.message}`,
      });
    } else {
      console.log('Free tier and credits granted for user:', userId);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) throw error;
      if (!data) throw new Error('No data returned from authentication');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message || "Could not sign in with Google. Please try again.",
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
            description: "Please check your email and confirm your account before signing in.",
            variant: "destructive",
          });
          return;
        }

        await grantFreeTier(data.user.id);
        handleSuccessfulAuth(data.user);
      } else {
        const { error, data } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });

        console.log("Signup response:", { data, error });
        if (error) {
          console.error("Signup error details:", error);
          throw error;
        }

        if (data.user && !data.session) {
          toast({
            title: "Check your email",
            description: "A verification email has been sent. Please confirm your email to continue.",
          });
          return;
        }

        if (data.user?.identities?.length === 0) {
          toast({
            variant: "destructive",
            title: "Account already exists",
            description: "An account with this email already exists. Please sign in instead.",
          });
          setIsLogin(true);
          return;
        }

        if (data.user && data.session) {
          await grantFreeTier(data.user.id);
          toast({
            title: "Account created successfully!",
            description: "Welcome aboard! Redirecting you to continue.",
          });
          handleSuccessfulAuth(data.user);
        }
      }
    } catch (error: any) {
      console.error("Caught error:", error);
      let errorTitle = "Error";
      let errorDescription = error.message || "An unexpected error occurred. Please try again.";

      if (error.message?.includes("Invalid login credentials")) {
        errorTitle = "Invalid Credentials";
        errorDescription = "The email or password you entered is incorrect.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorTitle = "Email Not Verified";
        errorDescription = "Please verify your email before signing in.";
      } else if (error.message?.includes("Password should be")) {
        errorTitle = "Invalid Password";
        errorDescription = "Password must be at least 6 characters long.";
      } else if (error.message?.includes("User already registered")) {
        errorTitle = "Account Exists";
        errorDescription = "This email is already registered. Please sign in.";
      } else if (error.message?.includes("network") || error.message?.includes("connection")) {
        errorTitle = "Network Error";
        errorDescription = "Please check your internet connection.";
      } else if (error.message?.includes("rate limit")) {
        errorTitle = "Too Many Attempts";
        errorDescription = "Please wait a few minutes before trying again.";
      }

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorDescription,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulAuth = async (user: any) => {
    if (!isLogin && !user.app_metadata.provider) {
      setShowNameDialog(true);
    } else {
      navigate(productId ? "/billing" : "/dashboard");
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
              ? "Don't have an account? Sign Up"
              : "Already have an account? Log In"}
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
