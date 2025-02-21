import { ArrowRight, Check, CreditCard, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { AnimatedTitle } from "@/components/ui/animated-hero";
const Index = () => {
  const features = [{
    title: "48 Blog Posts Ready To Post",
    description: "Fully SEO optimized blog posts that already include interlinking, external linking, and are already formatted with headers so you can just copy and paste posts onto your website"
  }, {
    title: "360 Google Business Posts In CSV",
    description: "Ready to schedule GBP posts that are SEO optimized and pre-formatted in GoHighLevel's social planner csv for easy 1 click imports"
  }, {
    title: "1000+ Top Backlinks from Local Competitors",
    description: "Get a complete list of the top backlinks from the local competition, including dofollow / nofollow tags, domain rating, and more"
  }, {
    title: "KW Research, SERP Research, GBP Optimization",
    description: "Get keyword data complete with CPC, KD, and search volume, along with a list of the top 100 local competitors nearby, and a Google Business Profile optimization checklist"
  }];
  const plans = [{
    id: "3a66f202-9e69-4adf-be5b-d50ed21ca619",
    // Add the actual product ID from your stripe_products table
    name: "Starter Pack",
    price: 30,
    description: "Perfect for trying out the service",
    features: ["3 runs", "No commitment", "Basic support", "Usage analytics"]
  }, {
    id: "d04d2c11-1111-2222-3333-444455556666",
    // Add the actual product ID from your stripe_products table
    name: "Growth Pack",
    price: 97,
    description: "Most popular for growing businesses",
    features: ["15 runs", "No commitment", "Priority support", "Advanced analytics"]
  }];
  return <div className="min-h-screen overflow-hidden bg-[#030303]">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-30" />
        
        <div className="relative pt-32 lg:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-8 mb-16">
              <div className="inline-block">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20 mb-8">Released 02.21.25 | Beta Version 1.1</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                <span className="block bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent mb-2">Complete Your</span>
                <AnimatedTitle />
                <span className="block mt-2 bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent">In One Click</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">Built for marketing agencies to deliver SEO campaigns in record time. Sign up today and try it out for free.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/auth" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-2xl text-black bg-primary hover:bg-primary/90 transition-all duration-200 shadow-[0_0_30px_rgba(46,213,115,0.4)]">
                  Try It For Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a href="#pricing" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-2xl text-white bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10">
                  Pricing
                </a>
              </div>
            </div>

            {/* Video Section with Scroll Animation */}
            <div className="flex flex-col overflow-hidden -mt-20">
              <ContainerScroll titleComponent={<div className="h-4" />}>
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="text-center">
                      <p className="text-white/90 text-xl font-medium mb-4">Demo Video Coming Soon</p>
                      <span className="px-4 py-2 rounded-full bg-white/10 text-white/70 text-sm">
                        Sign up for early access
                      </span>
                    </div>
                  </div>
                </div>
              </ContainerScroll>
            </div>

            {/* Features Section */}
            <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
              <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-30" />
              <div className="max-w-7xl mx-auto relative">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                    What You Get With Each Run
                  </h2>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Everything you need to deliver a complete SEO campaign
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {features.map((feature, index) => <div key={index} className="group p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.05] backdrop-blur-sm">
                      <div className="space-y-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-transparent text-primary group-hover:scale-110 transition-transform duration-300">
                          <Check className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>)}
                </div>
              </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative">
              <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-30" />
              <div className="max-w-7xl mx-auto relative">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                    Simple, Transparent Pricing
                  </h2>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Choose the perfect plan for your automation needs
                  </p>
                </div>

                {/* Main Plans */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {plans.map((plan, index) => <div key={index} className="group p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.05] backdrop-blur-sm">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                          <p className="text-gray-400">{plan.description}</p>
                        </div>
                        
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold text-white">${plan.price}</span>
                          <span className="ml-2 text-gray-400">/ month</span>
                        </div>

                        <ul className="space-y-4">
                          {plan.features.map((feature, idx) => <li key={idx} className="flex items-start gap-3">
                              <Check className="h-6 w-6 text-primary flex-shrink-0" />
                              <span className="text-gray-300">{feature}</span>
                            </li>)}
                        </ul>

                        <Link to={`/auth?productId=${plan.id}`} className="flex items-center justify-center w-full gap-2 px-6 py-4 text-lg font-medium rounded-2xl bg-primary text-black hover:bg-primary/90 transition-all duration-200">
                          Get Started
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>)}
                </div>

                {/* Enterprise Plan */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.08] backdrop-blur-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    <div className="space-y-4 md:max-w-xl">
                      <h3 className="text-2xl font-bold text-white">Enterprise</h3>
                      <p className="text-gray-400">For agencies and large businesses with custom requirements. Includes unlimited runs, dedicated support, and custom integrations.</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {["Unlimited runs", "Custom integrations", "24/7 Premium support", "API access", "Dedicated account manager"].map((feature, idx) => <li key={idx} className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </li>)}
                      </ul>
                    </div>
                    <div className="flex-shrink-0">
                      <a href="https://boldslate.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all duration-200 border border-white/10">
                        Contact Us
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <div className="py-24 px-4 sm:px-6 lg:px-8 relative">
              <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-30" />
              <div className="max-w-4xl mx-auto text-center space-y-8 relative">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Ready to revolutionize your SEO?
                </h2>
                <p className="text-xl text-gray-400">
                  Join the future of SEO automation today.
                </p>
                <Link to="/auth" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-2xl text-black bg-primary hover:bg-primary/90 transition-all duration-200 shadow-[0_0_30px_rgba(46,213,115,0.4)]">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;