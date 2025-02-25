import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#030303]">
      <div className="relative pt-36 lg:pt-44 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-30" />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center space-y-8">
            <h1 className="text-7xl sm:text-8xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent animate-fadeIn">
              404
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fadeIn">
              Oops! The page you're looking for doesn't exist
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-2xl text-white bg-primary hover:bg-primary/90 transition-all duration-200 shadow-[0_0_30px_rgba(46,213,115,0.4)] animate-fadeIn"
            >
              Return to Home
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
