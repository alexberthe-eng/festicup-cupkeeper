import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const reviews = [
  {
    name: "Marie L.",
    rating: 5,
    text: "Service impeccable ! Les gobelets étaient de très bonne qualité et la livraison rapide. Je recommande vivement pour tous vos événements.",
    date: "12/03/2025",
    verified: true,
    avatar: "🇫🇷",
  },
  {
    name: "Thomas D.",
    rating: 5,
    text: "Nous avons commandé pour notre mariage. Le rendu était parfait et le service client très réactif. Merci Festicup !",
    date: "28/02/2025",
    verified: true,
    avatar: "🇧🇪",
  },
  {
    name: "Sophie M.",
    rating: 5,
    text: "Location de gobelets pour notre festival. Tout s'est très bien passé, de la commande au retour. Rapport qualité/prix excellent.",
    date: "15/01/2025",
    verified: true,
    avatar: "🇫🇷",
  },
  {
    name: "Pierre B.",
    rating: 4,
    text: "Très satisfait de la qualité des gobelets. La personnalisation est top et l'équipe est très professionnelle.",
    date: "05/12/2024",
    verified: true,
    avatar: "🇧🇪",
  },
];

const AvisSection = () => {
  const [scrollIndex, setScrollIndex] = useState(0);

  return (
    <section className="py-14 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-2xl lg:text-4xl font-serif font-bold text-center mb-8">
          Ils nous font confiance
        </h2>

        {/* Badge SAG */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 bg-secondary rounded-xl px-5 py-3">
            <div className="text-center">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-festicup-gold">4.8</span>
                <span className="text-xs text-muted-foreground">/5</span>
              </div>
              <div className="flex gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3 h-3 fill-festicup-gold text-festicup-gold" />
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">1 522 avis</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-xs font-semibold">Avis Garantis</p>
              <p className="text-[10px] text-muted-foreground">Avis clients certifiés</p>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={() => setScrollIndex(Math.max(0, scrollIndex - 1))}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScrollIndex(Math.min(reviews.length - 1, scrollIndex + 1))}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            aria-label="Suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Reviews carousel */}
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="snap-start shrink-0 w-[260px] lg:w-[280px] bg-background border border-border rounded-xl p-5"
            >
              <div className="flex items-center gap-0.5 mb-2.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < review.rating ? "fill-festicup-gold text-festicup-gold" : "text-border"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-foreground mb-3 leading-relaxed line-clamp-4">
                "{review.text}"
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{review.avatar}</span>
                  <span className="text-xs font-medium">{review.name}</span>
                </div>
                {review.verified && (
                  <span className="text-[9px] uppercase tracking-wide text-festicup-gold font-medium">
                    Vérifié
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvisSection;
