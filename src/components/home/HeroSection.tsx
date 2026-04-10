import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text */}
          <div className="flex-1 max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              Le leader belge
              <br />
              <span className="text-festicup-gold italic font-bold">
                de la vente et location
                <br />
                de gobelets réutilisables
              </span>
            </h1>
            <p className="text-festicup-text-secondary text-base lg:text-lg mb-8 max-w-md">
              Achat et location de gobelets réutilisables et verres incassables premium.
            </p>
            <Link to="/achat">
              <Button className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-lg px-8 py-6 text-base font-medium">
                Découvrir la gamme
              </Button>
            </Link>
          </div>

          {/* Image circulaire */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="w-72 h-72 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden bg-festicup-dark">
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"
                alt="Foule en fête avec gobelets réutilisables"
                className="w-full h-full object-cover grayscale"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
