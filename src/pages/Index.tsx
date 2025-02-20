
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { AnimatedTitle } from "@/components/ui/animated-hero";

const Index = () => {
  const features = [
    {
      title: "Your AI Assistant",
      description: "Automate your SEO tasks instantly with our intelligent AI engine"
    },
    {
      title: "Seamless Integration",
      description: "Connect with your existing tools in just one click"
    },
    {
      title: "Real-time Analytics",
      description: "Track your SEO performance with live insights"
    },
    {
      title: "Smart Automation",
      description: "Let AI handle your repetitive SEO tasks"
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#030303]">
      {/* Hero Section */}
      <div className="relative">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-30" />
        
        <div className="relative pt-32 lg:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-8 mb-16">
              <div className="inline-block">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20 mb-8">
                  Launching soon - Join the waitlist
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                <span className="block bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent mb-2">
                  Automate Your
                </span>
                <span className="flex items-center justify-center gap-4 bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent">
                  <AnimatedTitle /> with
                </span>
                <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-[#95F9C3] bg-clip-text text-transparent">
                  Artificial Intelligence
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                The most advanced AI-powered SEO automation platform. Transform your workflow with intelligent optimization.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-2xl text-black bg-primary hover:bg-primary/90 transition-all duration-200 shadow-[0_0_30px_rgba(46,213,115,0.4)]"
                >
                  Get Early Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-2xl text-white bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10"
                >
                  Watch Demo
                </a>
              </div>
            </div>

            {/* Video Section with Scroll Animation */}
            <div id="demo" className="relative">
              <ContainerScroll
                titleComponent={
                  <h2 className="text-3xl font-bold text-white/90 mb-8">
                    Experience the Future of SEO
                  </h2>
                }
              >
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white/50 text-lg">Product Demo Video</p>
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>
              </ContainerScroll>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-24">
              {[
                { value: "10x", label: "Faster SEO" },
                { value: "24/7", label: "Automation" },
                { value: "100%", label: "AI Powered" },
                { value: "1-Click", label: "Integration" }
              ].map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-30" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              AI-Powered SEO Automation
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the future of SEO with our advanced AI technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.05] backdrop-blur-sm"
              >
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
              </div>
            ))}
          </div>
        </div>
      </div>

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
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-2xl text-black bg-primary hover:bg-primary/90 transition-all duration-200 shadow-[0_0_30px_rgba(46,213,115,0.4)]"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
