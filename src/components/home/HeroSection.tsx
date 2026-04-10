import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Text */}
          <div className="flex-1 max-w-xl">
            <h1 className="text-[32px] md:text-5xl lg:text-[56px] font-serif font-bold leading-[1.15] mb-5">
              Le leader belge
              <br />
              <span className="text-festicup-gold italic">
                de la vente et{" "}
              </span>
              <br className="hidden lg:block" />
              <span className="text-festicup-gold italic">
                location
              </span>
              <br />
              <span className="text-festicup-gold italic">
                de gobelets
              </span>
              <br />
              <span className="text-festicup-gold italic">
                réutilisables
              </span>
            </h1>
            <p className="text-muted-foreground text-sm lg:text-base mb-7 max-w-sm leading-relaxed">
              Achat et location de gobelets réutilisables et verres incassables premium.
            </p>
            <Link to="/achat">
              <Button className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-lg px-7 h-11 text-sm font-medium">
                Découvrir la gamme
              </Button>
            </Link>
          </div>

          {/* Image circulaire */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] rounded-full overflow-hidden">
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
