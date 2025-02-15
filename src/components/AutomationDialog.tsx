
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AutomationForm from "./AutomationForm";

const AutomationDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative overflow-hidden rounded-lg p-1 cursor-pointer transition-transform hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9b87f5] via-[#8B5CF6] to-[#D946EF] animate-gradient" />
          <div className="relative bg-card p-8 rounded-lg backdrop-blur-sm border border-white/20">
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Start Your Automation
            </h3>
            <p className="text-muted-foreground mb-4">
              Ready to streamline your workflow? Launch your automation in minutes.
            </p>
            <Button variant="secondary" className="group">
              Start Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
