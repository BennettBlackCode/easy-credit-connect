
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    "Free credit to get started",
    "Automated workflow integration",
    "Real-time run tracking",
    "Flexible credit packages",
    "Premium support",
    "Google account integration",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-secondary">
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Automate Your SEO
              <br />
              <span className="text-primary">With One Click</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your business processes with our powerful automation
              platform. Start with a free credit and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-hover transition-colors duration-200 electric-glow"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary/20 text-base font-medium rounded-md text-white bg-black/40 hover:bg-black/60 transition-colors duration-200 neo-gradient"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-lg hover:shadow-md transition-shadow animate-fadeIn"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10 text-primary">
                      <Check className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    {feature}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of businesses automating their SEO today.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-hover transition-colors duration-200 electric-glow"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
