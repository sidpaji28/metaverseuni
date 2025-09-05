import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-neon bg-card/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-aurora rounded-full animate-pulse-glow"></div>
          <h1 className="text-xl font-bold text-neon-primary">Metaverse University</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-foreground hover:text-neon-primary transition-colors">
            Features
          </a>
          <a href="#gamified" className="text-foreground hover:text-neon-primary transition-colors">
            Gamified Learning
          </a>
          <a href="#campus" className="text-foreground hover:text-neon-primary transition-colors">
            Virtual Campus
          </a>
          <a href="#about" className="text-foreground hover:text-neon-primary transition-colors">
            About
          </a>
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <Button 
              onClick={handleAuthClick}
              className="bg-primary text-primary-foreground glow-primary hover:glow-secondary"
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="border-neon text-neon-primary hover:glow-primary"
                onClick={handleAuthClick}
              >
                Sign In
              </Button>
              <Button 
                className="bg-primary text-primary-foreground glow-primary hover:glow-secondary"
                onClick={handleAuthClick}
              >
                Join the Future
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;