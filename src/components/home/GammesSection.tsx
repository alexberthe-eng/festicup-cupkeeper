import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const GammesSection = () => {
  return (
    <section className="bg-festicup-bg-light py-12 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card Ecocup */}
          <div className="relative rounded-2xl overflow-hidden bg-festicup-dark min-h-[380px] lg:min-h-[440px] flex flex-col justify-end p-8 group">
            <img
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
              alt="Ambiance festival"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
            />
            <div className="relative z-10">
              <span className="text-xs uppercase tracking-widest text-white/70 mb-2 block">La gamme Ecocup</span>
              <p className="text-white/80 text-sm mb-2">
                Gobelet réutilisable standard — essentiel de l'événement
              </p>
              <h3 className="text-white text-2xl lg:text-3xl font-serif font-bold mb-2">
                Gamme Ecocup
              </h3>
              <p className="text-white/70 text-sm mb-6">
                5 références, dès 0,76€ pièce — Achat et location
              </p>
              <Link to="/achat?gamme=ecocup">
                <Button className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-lg px-6">
                  Découvrir la gamme
                </Button>
              </Link>
            </div>
          </div>

          {/* Card Prestige */}
          <div className="relative rounded-2xl overflow-hidden bg-festicup-gold min-h-[380px] lg:min-h-[440px] flex flex-col justify-end p-8 group">
            <img
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"
              alt="Verres premium"
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
            />
            <div className="relative z-10">
              <span className="text-xs uppercase tracking-widest text-white/70 mb-2 block">La gamme Prestige</span>
              <p className="text-white/90 text-sm mb-2">
                Verres premium incassables — L'élégance sans compromis
              </p>
              <h3 className="text-white text-2xl lg:text-3xl font-serif font-bold mb-2">
                Gamme Prestige
              </h3>
              <p className="text-white/80 text-sm mb-6">
                12 références, dès 2,95€ pièce — Achat et location
              </p>
              <Link to="/achat?gamme=prestige">
                <Button className="bg-festicup-dark hover:bg-foreground text-white rounded-lg px-6">
                  Découvrir la gamme
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GammesSection;
