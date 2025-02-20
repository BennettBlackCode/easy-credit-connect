
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { EmailPasswordForm } from "@/components/auth/EmailPasswordForm";
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/utils/auth";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await signInWithEmail(values);
        if (error) throw error;
        navigate("/dashboard");
      } else {
        const { error } = await signUpWithEmail(values);
        if (error) throw error;
        toast({
          title: "Success!",
          description: "Account created successfully. You can now log in.",
        });
        setIsLogin(true);
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
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign In Failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303] px-4">
      <div className="w-full max-w-md space-y-8 bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/5">
        <AuthHeader isLogin={isLogin} />

        <GoogleSignInButton onClick={handleGoogleSignIn} isLoading={isLoading} />

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

        <EmailPasswordForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isLogin={isLogin}
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
    </div>
  );
};

export default Auth;
