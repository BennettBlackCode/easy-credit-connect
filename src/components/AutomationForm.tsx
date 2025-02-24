import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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

const formSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  last_name: z.string().min(1, "Last name is required"),
  industry: z.string().min(1, "Industry is required"),
  domain: z.string().min(1, "Domain is required"),
  web_url: z.string().min(1, "Web URL is required"),
  agency_email: z.string().email("Invalid email format"),
  email: z.string().email("Invalid email format"),
  street_address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postal_code: z.string().min(1, "Postal code is required"),
});

export type FormValues = z.infer<typeof formSchema>;

interface AutomationFormProps {
  onSubmit?: (values: FormValues) => Promise<void>;
  isSubmitting?: boolean;
  remainingCredits?: number;
}

const AutomationForm = ({ onSubmit, isSubmitting = false, remainingCredits = 0 }: AutomationFormProps) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      phone_number: "",
      last_name: "",
      industry: "",
      domain: "",
      web_url: "",
      agency_email: "",
      email: "",
      street_address: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to run automations",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Check available credits
    const { data: userData } = await supabase
      .from("user_summary")
      .select("remaining_credits")
      .eq("user_id", session.user.id)
      .single();

    if (!userData || userData.remaining_credits < 1) {
      toast({
        title: "Insufficient Credits",
        description: "You need at least 1 credit to run this automation",
        variant: "destructive",
      });
      return;
    }

    if (onSubmit) {
      await onSubmit(values);
    } else {
      try {
        const { error } = await supabase
          .from("automation_logs")
          .insert({
            ...values,
            user_id: session.user.id,
          });
  
        if (error) throw error;
  
        toast({
          title: "Success",
          description: "Automation started successfully",
        });
  
        form.reset();
      } catch (error: any) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to run automation. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name *</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Client Phone Number *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name *</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Industry *</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Domain *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="web_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Web URL</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Agency Email *</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address *</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>City *</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>State *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Running Automation..." : "Run Automation"}
        </Button>
      </form>
    </Form>
  );
};

export default AutomationForm;
