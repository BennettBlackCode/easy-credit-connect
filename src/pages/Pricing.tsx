import { ArrowRight, Check, CreditCard, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
const Pricing = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    session
  } = useAuth();
  const {
    data: products
  } = useQuery({
    queryKey: ['stripe_products'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('stripe_products').select('*');
      if (error) throw error;
      return data;
    }
  });
  const handleGetStarted = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase a plan",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    navigate("/billing");
  };
  const plans = [{
    id: "3588c408-881f-4258-9cc9-fad1479d8d42",
    name: "Starter Pack",
    description: "Perfect for trying out the service",
    price: 30,
    features: ["3 runs", "No commitment", "Basic support", "Usage analytics"],
    buttonText: "Get Started",
    icon: CreditCard
  }, {
    id: "3a66f202-9e69-4adf-be5b-d50ed21ca619",
    name: "Growth Pack",
    price: 97,
    description: "Most popular for growing businesses",
    features: ["15 runs", "No commitment", "Priority support", "Advanced analytics"],
    buttonText: "Start Growth",
    featured: true,
    icon: CreditCard
  }, {
    id: "4d3cebb2-f572-4bfa-a604-7a51473e7ab5",
    name: "Professional",
    price: null,
    priceLabel: "Custom pricing",
    description: "For businesses with high automation needs",
    features: ["Unlimited runs", "Custom billing options", "24/7 Premium support", "Access to all workflows", "Advanced analytics", "API access", "Custom integrations", "Dedicated account manager"],
    buttonText: "Contact Us",
    icon: Mail
  }];
  return <div className="py-24 px-4 sm:px-6 lg:px-8 relative" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your automation needs. All plans include access to our full feature set.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map(plan => <div key={plan.id} className={`pricing-card relative rounded-3xl p-8 bg-[#0A0A0A] border border-transparent transition-all duration-500 ${plan.featured ? "md:-mt-4 md:mb-4" : ""}`}>
              {plan.featured && <div className="absolute -top-3 right-6">
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary text-black">
                    Most Popular
                  </span>
                </div>}

              <div className="flex flex-col h-full">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <div className="mb-8">
                  {plan.price !== null ? <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="ml-2 text-gray-400">/ per month</span>
                    </div> : <div className="text-3xl font-bold text-white">{plan.priceLabel}</div>}
                </div>

                <div className="flex-grow">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map(feature => <li key={feature} className="flex items-start gap-3">
                        <Check className="h-6 w-6 text-primary flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>)}
                  </ul>
                </div>

                <button onClick={handleGetStarted} className="flex items-center justify-center w-full gap-2 px-6 py-4 text-lg font-medium rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-200">
                  {plan.buttonText}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>)}
        </div>
      </div>

      <style jsx>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        .pricing-card::before,
        .pricing-card::after {
          content: "";
          position: absolute;
          inset: -1px;
          z-index: -1;
          background: linear-gradient(
            var(--gradient-angle),
            #2ed573,
            transparent 40%,
            transparent 60%,
            #2ed573
          );
          border-radius: inherit;
          animation: rotation 7s linear infinite;
          opacity: 0;
          transition: opacity 0.5s;
        }

        .pricing-card::after {
          filter: blur(15px);
        }

        .pricing-card:hover::before,
        .pricing-card:hover::after {
          opacity: 1;
        }

        @keyframes rotation {
          0% { --gradient-angle: 0deg; }
          100% { --gradient-angle: 360deg; }
        }
      `}</style>
    </div>;
};
export default Pricing;