import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-neon-secondary/20 rounded-full blur-xl floating"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-neon-primary/20 rounded-full blur-xl floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-neon-tertiary/20 rounded-full blur-xl floating" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-slide-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Welcome to the
            <br />
            <span className="bg-aurora bg-clip-text text-transparent">
              Metaverse University
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Experience next-generation education in immersive VR/AR environments. 
            Connect with students worldwide, earn blockchain-verified degrees, 
            and learn with AI-powered mentorship.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground glow-primary hover:glow-secondary px-8 py-4 text-lg"
            >
              Enter the Metaverse
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-neon text-neon-primary hover:glow-soft px-8 py-4 text-lg"
            >
              Watch Demo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-primary mb-2">50k+</div>
              <div className="text-muted-foreground">Global Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-secondary mb-2">200+</div>
              <div className="text-muted-foreground">VR Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-tertiary mb-2">100%</div>
              <div className="text-muted-foreground">Blockchain Verified</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;