
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
    queryKey: ["frontend-users", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("frontend_users")
        .select("remaining_credits, total_credits")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!session) {
      navigate("/auth");
    }
  }, [session, navigate]);

  const onSubmit = async (values: FormValues) => {
    if (!userData?.remaining_credits || userData.remaining_credits <= 0) {
      toast({
        title: "Insufficient credits",
        description: "You don't have enough credits to run this automation. Please purchase more credits.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // First create the automation log
      const { data: automationLog, error: logError } = await supabase
        .from("automation_logs")
        .insert([{
          user_id: session?.user?.id,
          company_name: values.company_name,
          phone_number: values.phone_number,
          last_name: values.last_name,
          industry: values.industry,
          domain: values.domain,
          web_url: values.web_url,
          agency_email: values.agency_email,
          email: values.email,
          street_address: values.street_address,
          city: values.city,
          state: values.state,
          country: values.country,
          postal_code: values.postal_code,
          status: 'pending',
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (logError) {
        throw logError;
      }

      // Then call the automation function
      const { error: functionError } = await supabase.functions.invoke('run-automation', {
        body: {
          automationId: automationLog.id,
          userId: session?.user?.id,
        },
      });

      if (functionError) {
        throw functionError;
      }

      toast({
        title: "Automation started",
        description: "Your automation has been started successfully.",
      });
      
      // Redirect to dashboard after successful submission
      navigate("/dashboard");
    } catch (error) {
      console.error("Automation Error:", error);
      toast({
        title: "Error",
        description: "Failed to run automation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["frontend-users"] });
    }
  };

  return (
    <div className="container py-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Run Automation</h1>
          <div className="text-sm">
            Available Credits: <span className="font-bold">{userData?.remaining_credits || 0}</span>
          </div>
        </div>
        <AutomationForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          remainingCredits={userData?.remaining_credits || 0}
        />
      </div>
    </div>
  );
};

export default Automation;
