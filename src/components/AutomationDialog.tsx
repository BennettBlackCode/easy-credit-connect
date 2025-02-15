
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AutomationForm from "./AutomationForm";

const AutomationDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative overflow-hidden rounded-lg p-1 cursor-pointer transition-transform hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F2FCE2] via-[#E5DEFF] to-[#f0e7ff] animate-gradient" />
          <div className="relative bg-white/90 p-8 rounded-lg backdrop-blur-sm border border-violet-100 shadow-lg">
            <h3 className="text-2xl font-bold mb-2 text-gray-800">
              Start Your Automation
            </h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Ready to streamline your workflow? Launch your automation in minutes.
            </p>
            <Button 
              variant="default" 
              size="lg"
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-lg shadow-violet-200/50 group font-semibold text-base"
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
