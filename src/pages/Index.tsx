
import { ArrowRight, Check } from "lucide-react";
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

  return <div className="min-h-screen overflow-hidden bg-[#030303]">
      {/* Hero Section */}
      <div className="relative">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-30" />
        
        <div className="relative pt-32 lg:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-8 mb-16">
              <div className="inline-block">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20 mb-8">Released 02.21.25 | Beta Version 2.0</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                <span className="block bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent mb-2">
                  Automate Your
                </span>
                <AnimatedTitle />
                <span className="block mt-2 bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent">In One Click</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">Built for marketing agencies to deliver SEO campaigns in record time. Sign up today and try it out for free.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/signup" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-2xl text-black bg-primary hover:bg-primary/90 transition-all duration-200 shadow-[0_0_30px_rgba(46,213,115,0.4)]">
                  Try It For Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a href="#demo" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-2xl text-white bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10">
                  Watch Demo
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

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-24">
              {[{
              value: "48+",
              label: "Blog Posts"
            }, {
              value: "360",
              label: "GBP Posts"
            }, {
              value: "1000+",
              label: "Backlinks"
            }, {
              value: "100%",
              label: "Automated"
            }].map((stat, index) => <div key={index} className="text-center space-y-2">
                  <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>)}
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
          <Link to="/signup" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-2xl text-black bg-primary hover:bg-primary/90 transition-all duration-200 shadow-[0_0_30px_rgba(46,213,115,0.4)]">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-4" />
          </Link>
        </div>
      </div>
    </div>;
};

export default Index;
