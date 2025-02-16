
import { Check, CreditCard, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  const handlePlanClick = (isExternal: boolean, href: string) => {
    if (isExternal) {
      window.open(href, '_blank');
      return;
    }

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase a plan",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    navigate(href);
  };

  const plans = [
    {
      name: "Starter Pack",
      price: "30",
      interval: "monthly",
      description: "Perfect for trying out the service",
      features: [
        "3 runs",
        "No commitment",
        "Basic support",
        "Access to all workflows",
        "Usage analytics",
      ],
      href: "/billing",
      buttonText: "Get Started",
    },
    {
      name: "Growth Pack",
      price: "97",
      interval: "monthly",
      description: "Most popular for growing businesses",
      features: [
        "15 runs",
        "No commitment",
        "Priority support",
        "Access to all workflows",
        "Advanced analytics",
        "API access",
      ],
      href: "/billing",
      buttonText: "Start Growth",
      featured: true,
    },
    {
      name: "Professional",
      price: "Custom",
      interval: "pricing",
      description: "For businesses with high automation needs",
      features: [
        "Unlimited runs",
        "Custom billing options",
        "24/7 Premium support",
        "Access to all workflows",
        "Advanced analytics",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
      ],
      href: "https://1clickseo.io",
      buttonText: "Contact Us",
      isExternal: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-secondary py-24">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Choose the perfect plan for your automation needs. All plans include
            access to our full feature set.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.featured
                  ? "border-primary shadow-lg scale-105 glass-card"
                  : "glass-card"
              } transition-all duration-200 hover:shadow-lg`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">{plan.price === "Custom" ? "" : "$"}{plan.price}</span>
                  <span className="text-gray-300 ml-2">{plan.interval}</span>
                </div>
                <p className="text-gray-300 mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handlePlanClick(!!plan.isExternal, plan.href)}
                  className={`w-full mt-8 ${
                    plan.featured ? "bg-primary hover:bg-primary/90 electric-glow" : "neo-gradient"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {plan.isExternal ? (
                      <Mail className="h-5 w-5" />
                    ) : (
                      <CreditCard className="h-5 w-5" />
                    )}
                    {plan.buttonText}
                  </div>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Preview */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Have Questions?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Contact our support team or check out our FAQ section.
          </p>
          <Button variant="outline" asChild className="neo-gradient">
            <Link to="/faq">View FAQ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
