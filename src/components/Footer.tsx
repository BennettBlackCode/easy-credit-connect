
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const { session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/?section=" + sectionId);
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
  };

  const navigation = [
    { name: "Pricing", href: "/#pricing", onClick: () => scrollToSection("pricing") },
    ...(session
      ? [
          { name: "Dashboard", href: "/dashboard" },
          { name: "Billing", href: "/billing" },
        ]
      : [
          { name: "Sign In", href: "/auth" },
          { name: "Sign Up", href: "/auth?tab=signup" },
        ]),
  ];

  return (
    <footer className="border-t border-white/5 bg-black/40 backdrop-blur-xl mt-auto">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="py-8">
          <div className="flex flex-col items-center space-y-6">
            <Link
              to="/"
              className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              1clickseo.io
            </Link>
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick || (() => navigate(item.href))}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </nav>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} 1clickseo.io. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
