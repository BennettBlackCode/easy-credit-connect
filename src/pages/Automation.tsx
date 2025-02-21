import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  agency_email: z.string().email("Invalid email format"),
  domain: z
    .string()
    .min(1, "Domain is required")
    .refine(
      (value) => !value.startsWith("www.") && !value.startsWith("https://"),
      "Please enter domain without www. or https://"
    ),
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
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: userCredits } = useQuery({
    queryKey: ["user-calculated-credits"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("users_with_calculated_credits")
        .select("remaining_credits, total_credits")
        .eq("user_id", session.user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const remainingCredits = userCredits?.remaining_credits ?? 0;

  useEffect(() => {
    if (remainingCredits <= 0) {
      setShowCreditsDialog(true);
    }
  }, [remainingCredits]);

  const handleDialogChange = (open: boolean) => {
    setShowCreditsDialog(open);
    if (!open) {
      navigate("/dashboard");
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      industry: "",
      agency_email: session?.user?.email || "",
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

    if (!remainingCredits || remainingCredits <= 0) {
      toast({
        title: "Insufficient Credits",
        description: "You need at least 1 credit to run automations. Would you like to purchase more credits?",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    setIsSubmitting(true);

    try {
      const automationData = {
        user_id: session.user.id,
        company_name: values.company_name,
        industry: values.industry,
        agency_email: values.agency_email,
        domain: values.domain,
        phone_number: values.phone_number,
        street_address: values.address_line_1,
        city: values.city,
        state: values.state,
        postal_code: values.zip_code,
        email: session.user.email || "",
        country: "United States",
        last_name: "Unknown",
        web_url: `https://${values.domain}`,
      };

      const { error } = await supabase.from("automations").insert(automationData);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["user-calculated-credits"] });
      await queryClient.invalidateQueries({ queryKey: ["period-runs"] });
      await queryClient.invalidateQueries({ queryKey: ["recent-automations"] });

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
            <span className="text-sm text-gray-400">Available Credits: </span>
            <span className="text-primary font-semibold">{remainingCredits}</span>
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
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agency_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="bg-white/5 border-white/10" />
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

      <Dialog open={showCreditsDialog} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insufficient Credits</DialogTitle>
            <DialogDescription>
              You need at least 1 credit to run this automation. Would you like to purchase more credits?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => navigate("/billing")}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Purchase Credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Automation;
