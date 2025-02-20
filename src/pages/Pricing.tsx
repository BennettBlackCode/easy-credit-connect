
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  const { data: products } = useQuery({
    queryKey: ['stripe_products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stripe_products')
        .select('*')
        .order('price_amount', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

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
      price: products?.[0]?.price_amount || 197,
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
      price: products?.[1]?.price_amount || 297,
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
      price: null,
      buttonText: "Contact Sales",
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

          .pricing-card {
            position: relative;
          }

          .pricing-card::before,
          .pricing-card::after {
            content: "";
            position: absolute;
            inset: -2px;
            z-index: -1;
            background: linear-gradient(
              var(--gradient-angle),
              rgba(91, 108, 255, 0.5),
              rgba(91, 108, 255, 0),
              rgba(91, 108, 255, 0.5)
            );
            border-radius: inherit;
            animation: rotation 5s linear infinite;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .pricing-card::after {
            filter: blur(1rem);
          }

          .pricing-card:hover::before,
          .pricing-card:hover::after {
            opacity: 1;
          }

          @keyframes rotation {
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
              className={`pricing-card relative rounded-[32px] p-8 overflow-hidden bg-[#1A1A1A] ${
                plan.featured ? "md:scale-105 md:-mt-4" : ""
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
                        <Check className="h-6 w-6 text-[#5B6CFF] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-8">
                    {plan.price !== null ? (
                      <>
                        <span className="text-4xl font-bold text-white">${plan.price}</span>
                        <span className="text-gray-400">/mo</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-white">Contact Sales</span>
                    )}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
