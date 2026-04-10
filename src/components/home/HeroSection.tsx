import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-background/80" />

      {/* Content */}
      <div className="relative z-10 container text-center px-4 py-20">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-foreground tracking-tight mb-6 leading-tight">
          NOS COUPES SONT
          <br />
          <span className="text-gradient-gold">PARFAITES</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          On sait que vos soirées méritent ce qu'il y a de mieux.
          Gobelets réutilisables personnalisés pour tous vos événements.
        </p>
        <Button asChild size="lg" className="text-base px-8 py-6 rounded-lg font-semibold">
          <a href="#services">Découvrir le projet</a>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
