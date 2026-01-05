import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import studyVaultLogo from "@/assets/studyvault-logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Academic Resources", path: "/academic-resources" },
    { name: "Tools & Platforms", path: "/tools-platforms" },
    { name: "Mind Map", path: "/mindmap" },
    { name: "AI Study Helper", path: "/study-helper" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 card-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 transition-smooth hover:opacity-80">
            <img 
              src={studyVaultLogo} 
              alt="StudyVault Logo" 
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              StudyVault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 text-sm font-semibold transition-smooth rounded-md ${
                  isActive(item.path)
                    ? "text-primary bg-primary/15 font-bold"
                    : "text-foreground hover:text-primary hover:bg-primary/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button variant="accent" size="sm" className="ml-4" asChild>
              <Link to="/auth">Login</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-muted-foreground hover:text-primary transition-smooth"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-semibold transition-smooth rounded-md ${
                    isActive(item.path)
                      ? "text-primary bg-primary/15 font-bold"
                      : "text-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2">
                <Button variant="accent" size="sm" className="w-full" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;