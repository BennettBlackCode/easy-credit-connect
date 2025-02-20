
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  const handleGetStarted = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase a plan",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    navigate("/billing");
  };

  const plans = [
    {
      name: "Starter",
      description: "Ideal for business owners who prefer to take control and manage their own AI-powered systems.",
      features: [
        "24/7 AI Chatbot & Voice Assistant",
        "Website Builder, CRM, Email/SMS Marketing",
        "Calendar, Invoices, Payments",
        "Workflow & Review Management",
        "Email/Chat Support & Resources"
      ],
      price: "197",
      buttonText: "Get Started",
    },
    {
      name: "Growth",
      description: "Perfect for growing businesses that need advanced features and dedicated support.",
      features: [
        "Everything in Starter, plus:",
        "Advanced AI Optimization Tools",
        "Priority Email & Chat Support",
        "Custom Integration Options",
        "Monthly Strategy Calls"
      ],
      price: "297",
      buttonText: "Get Started",
      featured: true,
    },
    {
      name: "Unlimited Pack",
      description: "Ideal for business owners who want expert support managing their AI systems for maximum efficiency.",
      features: [
        "Everything in Growth, plus:",
        "Full AI Management & Optimization",
        "Dedicated Account Specialist",
        "24/7 Priority Support",
        "Personalized Onboarding & Training"
      ],
      price: "497",
      buttonText: "Get Started",
    }
  ];

  return (
    <div className="py-24 relative glow-gradient-parent" id="pricing">
      <style>
        {`
          @property --gradient-angle {
            syntax: "<angle>";
            initial-value: 0deg;
            inherits: false;
          }

          .glow-gradient-child::before,
          .glow-gradient-child::after {
            opacity: 0;
            content: "";
            position: absolute;
            inset: -5px;
            z-index: -1;
            background: conic-gradient(
              from var(--gradient-angle),
              rgba(46, 213, 115, 0.5),
              #fff,
              rgba(46, 213, 115, 0.5),
              #fff
            );
            border-radius: inherit;
            animation: rotation-glow 10s linear infinite;
            transition: opacity 1s;
          }

          .glow-gradient-child::after {
            filter: blur(2rem);
          }

          .glow-gradient-child:hover::before,
          .glow-gradient-child:hover::after {
            opacity: 1;
          }

          @keyframes rotation-glow {
            0% { --gradient-angle: 0deg; }
            100% { --gradient-angle: 360deg; }
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[32px] p-8 overflow-hidden glow-gradient-child ${
                plan.featured
                  ? "bg-[#1A1A1A] scale-105 md:-mt-4"
                  : "bg-[#1A1A1A]"
              }`}
            >
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-6">
                  {plan.name}
                </h3>
                <p className="text-gray-400 mb-12 text-lg">
                  {plan.description}
                </p>
                
                <div className="mb-12">
                  <h4 className="text-xl font-semibold text-white mb-6">What's included</h4>
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-8">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400">/mo</span>
                  </div>
                  <button
                    onClick={handleGetStarted}
                    className="flex items-center justify-center w-full gap-2 px-6 py-4 text-lg font-medium rounded-full bg-white text-black hover:bg-gray-100 transition-colors"
                  >
                    {plan.buttonText}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Gradient background effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
