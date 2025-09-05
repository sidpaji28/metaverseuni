import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import GamifiedLearning from "@/components/GamifiedLearning";
import CampusPreview from "@/components/CampusPreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-cosmic">
      <Header />
      <Hero />
      <Features />
      <GamifiedLearning />
      <CampusPreview />
    </div>
  );
};

export default Index;
