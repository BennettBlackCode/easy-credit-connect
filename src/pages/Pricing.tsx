
import { Check, CreditCard, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Pricing = () => {
  const plans = [
    {
      name: "Starter Pack",
      price: "30",
      interval: "one-time",
      description: "Perfect for trying out the service",
      features: [
        "3 runs",
        "No commitment",
        "Basic support",
        "Access to all workflows",
        "Usage analytics",
      ],
      href: "/signup?plan=starter",
      buttonText: "Get Started",
    },
    {
      name: "Growth Pack",
      price: "97",
      interval: "per month",
      description: "Most popular for growing businesses",
      features: [
        "15 runs per month",
        "Monthly billing",
        "Priority support",
        "Access to all workflows",
        "Advanced analytics",
        "API access",
      ],
      href: "/signup?plan=growth",
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
      href: "https://boldslate.com",
      buttonText: "Contact Us",
      isExternal: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary py-24">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
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
                  ? "border-primary shadow-lg scale-105 bg-card"
                  : "bg-card/60"
              } transition-all duration-200 hover:shadow-lg`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price === "Custom" ? "" : "$"}{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.interval}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full mt-8 ${
                    plan.featured ? "bg-primary hover:bg-primary-hover" : ""
                  }`}
                >
                  {plan.isExternal ? (
                    <a href={plan.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      <Mail className="h-5 w-5" />
                      {plan.buttonText}
                    </a>
                  ) : (
                    <Link to={plan.href} className="flex items-center justify-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {plan.buttonText}
                    </Link>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Preview */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Have Questions?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Contact our support team or check out our FAQ section.
          </p>
          <Button variant="outline" asChild>
            <Link to="/faq">View FAQ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
