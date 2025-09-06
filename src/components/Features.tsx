import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      title: "VR/AR Classrooms",
      description: "Immersive learning environments with realistic simulations and interactive experiments.",
      icon: "🥽",
      gradient: "from-neon-primary/20 to-neon-secondary/20"
    },
    {
      title: "Blockchain Degrees",
      description: "Tamper-proof, globally recognized credentials verified on the blockchain.",
      icon: "⛓️",
      gradient: "from-neon-secondary/20 to-neon-tertiary/20"
    },
    {
      title: "AI Mentorship",
      description: "Personalized learning paths with intelligent tutoring and progress tracking.",
      icon: "🤖",
      gradient: "from-neon-tertiary/20 to-neon-primary/20"
    },
    {
      title: "Global Collaboration",
      description: "Connect with students worldwide for real-time projects and networking.",
      icon: "🌍",
      gradient: "from-neon-primary/20 to-neon-secondary/20"
    },
    {
      title: "Gamified Learning",
      description: "Earn points, badges, and climb leaderboards while mastering new skills.",
      icon: "🏆",
      gradient: "from-neon-secondary/20 to-neon-tertiary/20"
    },
    {
      title: "Accessibility First",
      description: "Multi-language support with adjustable VR/AR settings for everyone.",
      icon: "♿",
      gradient: "from-neon-tertiary/20 to-neon-primary/20"
    }
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Revolutionary Learning
            <br />
            <span className="bg-aurora bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cutting-edge technology meets education to create an unprecedented learning experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-neon bg-card/50 backdrop-blur-sm hover:glow-soft transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-4 group-hover:animate-pulse-glow`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neon-primary">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;