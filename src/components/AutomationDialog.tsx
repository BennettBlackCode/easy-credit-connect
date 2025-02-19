
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AutomationForm from "./AutomationForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AutomationDialog = () => {
  const { session } = useAuth();

  const { data: userData } = useQuery({
    queryKey: ["user", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("remaining_runs, permanent_credits, subscription_credits")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const totalCredits = (userData?.remaining_runs || 0) + 
                      (userData?.permanent_credits || 0) + 
                      (userData?.subscription_credits || 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative overflow-hidden rounded-lg p-1 cursor-pointer transition-transform hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 animate-gradient" />
          <div className="relative bg-black/40 backdrop-blur-xl p-8 rounded-lg border border-primary/20">
            <h3 className="text-2xl font-bold bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent mb-2">
              Start Your Automation
            </h3>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              Ready to streamline your workflow? Launch your automation in minutes.
              <span className="block text-sm mt-2 text-primary">
                {totalCredits} credits available
              </span>
            </p>
            <Button 
              variant="default" 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-black shadow-[0_0_20px_rgba(46,213,115,0.3)] group font-semibold text-base"
            >
              Start Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Run Automation</DialogTitle>
        </DialogHeader>
        <AutomationForm />
      </DialogContent>
    </Dialog>
  );
};

export default AutomationDialog;
