
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  domain: z
    .string()
    .min(1, "Domain is required")
    .regex(/^[^www.https:\/\/].*$/, "Please enter domain without www. or https://"),
  phone_number: z.string().min(1, "Phone number is required"),
  address_line_1: z.string().min(1, "Address is required"),
  address_line_2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip_code: z.string().min(1, "ZIP code is required"),
});

type FormValues = z.infer<typeof formSchema>;

const Automation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: userData } = useQuery({
    queryKey: ["user-credits"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("users")
        .select("remaining_runs, permanent_credits, subscription_credits")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      domain: "",
      phone_number: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      zip_code: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to run automations",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const remainingRuns = userData?.remaining_runs || 0;
    const permanentCredits = userData?.permanent_credits || 0;
    const subscriptionCredits = userData?.subscription_credits || 0;
    const totalCredits = remainingRuns + permanentCredits + subscriptionCredits;

    if (totalCredits < 1) {
      toast({
        title: "Insufficient Credits",
        description: "You need at least 1 credit to run this automation",
        variant: "destructive",
      });
      navigate("/billing");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user metadata to access agency_email
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;

      const agencyEmail = currentUser?.user_metadata?.agency_email || currentUser?.email || "";

      const automationData = {
        user_id: session.user.id,
        company_name: values.company_name,
        domain: values.domain,
        phone_number: values.phone_number,
        street_address: values.address_line_1,
        city: values.city,
        state: values.state,
        postal_code: values.zip_code,
        agency_email: agencyEmail,
        email: session.user.email || "",
        country: "United States",
        industry: "Unknown",
        last_name: "Unknown",
        web_url: `https://${values.domain}`,
      };

      const { error } = await supabase.from("automations").insert(automationData);

      if (error) throw error;

      const webhookUrl = "https://boldslate.app.n8n.cloud/webhook/685d206b-107d-4b95-a7b4-9d07133417e7";
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(automationData),
      });

      if (!response.ok) {
        throw new Error("Failed to trigger automation webhook");
      }

      toast({
        title: "Success",
        description: "Automation started successfully",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24">
      <div className="max-w-2xl mx-auto px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Run Automation</h1>
          <div className="bg-white/5 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-400">Remaining Runs: </span>
            <span className="text-primary font-semibold">{(userData?.remaining_runs || 0) + (userData?.permanent_credits || 0) + (userData?.subscription_credits || 0)}</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain (no https or www)</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address_line_1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address_line_2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zip_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Running Automation..." : "Run Automation"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Automation;
