
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

interface AuthProps {
  defaultTab?: "sign-in" | "sign-up";
}

const Auth = ({ defaultTab = "sign-in" }: AuthProps) => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"sign-in" | "sign-up">(defaultTab);
  const navigate = useNavigate();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "sign-in" || tab === "sign-up") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container max-w-lg mx-auto px-4 py-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-400">Sign in to your account to continue</p>
      </div>

      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "sign-in" | "sign-up")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <SignInForm onSuccess={handleSuccess} />
          </TabsContent>
          <TabsContent value="sign-up">
            <SignUpForm onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
