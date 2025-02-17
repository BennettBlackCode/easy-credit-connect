
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      title: "Free Credit to Get Started",
      description: "Begin your automation journey with complimentary credits"
    },
    {
      title: "Automated Workflow Integration",
      description: "Seamlessly connect with your existing tools and processes"
    },
    {
      title: "Real-time Run Tracking",
      description: "Monitor your SEO automation progress in real-time"
    },
    {
      title: "Flexible Credit Packages",
      description: "Scale your automation needs with flexible pricing options"
    },
    {
      title: "Premium Support",
      description: "Get expert help whenever you need it"
    },
    {
      title: "Google Account Integration",
      description: "Connect directly with your Google tools and services"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-secondary/50 to-secondary">
      {/* Hero Section */}
      <div className="relative pt-32 lg:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                Automate Your SEO
              </span>
              <span className="block text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text">
                With One Click
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Transform your business processes with our powerful automation
              platform. Start with free credits and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-gradient-to-r from-primary to-primary-hover hover:opacity-90 transition-all duration-200 electric-glow"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 backdrop-blur-sm transition-all duration-200 border border-white/10"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Video Section */}
          <div className="relative max-w-5xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm bg-black/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/50 text-lg">Product Video Will Go Here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Everything You Need for SEO Automation
            </h2>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">
              Powerful features designed to streamline your SEO workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent border border-white/10 backdrop-blur-sm"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary group-hover:scale-110 transition-transform duration-300">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Ready to Transform Your SEO?
          </h2>
          <p className="text-xl text-gray-300">
            Join thousands of businesses automating their SEO workflow today.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-gradient-to-r from-primary to-primary-hover hover:opacity-90 transition-all duration-200 electric-glow"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
