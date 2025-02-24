
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AutomationForm, { FormValues } from "@/components/AutomationForm";

const Automation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const { data: userData } = useQuery({
    queryKey: ["user-summary", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("user_summary")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const remainingCredits = userData?.remaining_credits || 0;

  useEffect(() => {
    if (!session) {
      navigate("/auth");
    }
  }, [session, navigate]);

  const onSubmit = async (values: FormValues) => {
    if (remainingCredits <= 0) {
      toast({
        title: "Insufficient credits",
        description: "You don't have enough credits to run this automation. Please purchase more credits.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('run-automation', {
        body: {
          ...values,
          userId: session?.user?.id,
        },
      });

      if (error) {
        console.error("Function Invoke Error:", error);
        toast({
          title: "Error",
          description: "Failed to run automation. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log("Function Invoke Data:", data);
        toast({
          title: "Automation started",
          description: "Your automation has been started successfully.",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["user-summary"] });
    }
  };

  return (
    <div className="container py-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Run Automation</h1>
        <AutomationForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          remainingCredits={remainingCredits}
        />
      </div>
    </div>
  );
};

export default Automation;
