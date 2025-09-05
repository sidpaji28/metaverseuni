import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VirtualCampus from './3d/VirtualCampus';

const CampusPreview = () => {
  const [showVirtualTour, setShowVirtualTour] = useState(false);

  const handleTourClick = () => {
    setShowVirtualTour(true);
  };

  return (
    <section id="campus" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Your
            <br />
            <span className="bg-aurora bg-clip-text text-transparent">Virtual Campus</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Navigate through beautifully designed 3D spaces that bring learning to life.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Card className="border-neon bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-neon-primary/20 rounded-full flex items-center justify-center">
                    🏫
                  </div>
                  <h3 className="text-xl font-semibold text-neon-primary">Science Labs</h3>
                </div>
                <p className="text-muted-foreground">
                  Conduct virtual experiments with realistic physics simulations and molecular modeling.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-neon bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-neon-secondary/20 rounded-full flex items-center justify-center">
                    📚
                  </div>
                  <h3 className="text-xl font-semibold text-neon-secondary">Digital Library</h3>
                </div>
                <p className="text-muted-foreground">
                  Access millions of books, research papers, and interactive learning materials.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-neon bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-neon-tertiary/20 rounded-full flex items-center justify-center">
                    🎭
                  </div>
                  <h3 className="text-xl font-semibold text-neon-tertiary">Social Spaces</h3>
                </div>
                <p className="text-muted-foreground">
                  Meet fellow students in virtual lounges, study groups, and collaborative workspaces.
                </p>
              </CardContent>
            </Card>
            
            <Button 
              className="bg-primary text-primary-foreground glow-primary hover:glow-secondary w-full"
              onClick={handleTourClick}
            >
              Take Virtual Tour
            </Button>
          </div>
          
          <div className="relative">
            <div className="aspect-square bg-nebula rounded-3xl border border-neon p-8 flex items-center justify-center relative overflow-hidden">
              {showVirtualTour ? (
                <VirtualCampus />
              ) : (
                <>
                  {/* 3D Campus Visualization Placeholder */}
                  <div className="absolute inset-4 border-2 border-dashed border-neon-primary/30 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4 animate-float">🏛️</div>
                      <p className="text-neon-primary font-semibold">3D Campus View</p>
                      <p className="text-muted-foreground text-sm">Click "Take Virtual Tour" to explore</p>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-8 right-8 w-4 h-4 bg-neon-primary rounded-full animate-pulse"></div>
                  <div className="absolute bottom-12 left-12 w-3 h-3 bg-neon-secondary rounded-full animate-pulse" 
                       style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-1/3 left-8 w-2 h-2 bg-neon-tertiary rounded-full animate-pulse" 
                       style={{ animationDelay: '2s' }}></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampusPreview;