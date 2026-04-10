import { Star } from "lucide-react";

const reviews = [
  {
    name: "Marie L.",
    rating: 5,
    text: "Service impeccable ! Les gobelets étaient de très bonne qualité et la livraison rapide. Je recommande vivement pour tous vos événements.",
    verified: true,
  },
  {
    name: "Thomas D.",
    rating: 5,
    text: "Nous avons commandé pour notre mariage. Le rendu était parfait et le service client très réactif. Merci Festicup !",
    verified: true,
  },
  {
    name: "Sophie M.",
    rating: 5,
    text: "Location de gobelets pour notre festival. Tout s'est très bien passé, de la commande au retour. Rapport qualité/prix excellent.",
    verified: true,
  },
  {
    name: "Pierre B.",
    rating: 4,
    text: "Très satisfait de la qualité des gobelets. La personnalisation est top et l'équipe est très professionnelle.",
    verified: true,
  },
];

const AvisSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-center mb-12">
          Ils nous font confiance
        </h2>

        {/* Badge SAG */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-4 bg-secondary rounded-2xl px-6 py-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-festicup-gold">4.8</p>
              <div className="flex gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-festicup-gold text-festicup-gold" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">1 522 avis</p>
            </div>
            <div className="text-left border-l border-border pl-4">
              <p className="text-sm font-semibold">Société des Avis Garantis</p>
              <p className="text-xs text-muted-foreground">Avis clients certifiés</p>
            </div>
          </div>
        </div>

        {/* Reviews carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="snap-start shrink-0 w-[300px] bg-background border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "fill-festicup-gold text-festicup-gold" : "text-border"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-foreground mb-4 leading-relaxed line-clamp-4">
                "{review.text}"
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇫🇷</span>
                  <span className="text-sm font-medium">{review.name}</span>
                </div>
                {review.verified && (
                  <span className="text-[10px] uppercase tracking-wide text-festicup-gold font-medium">
                    Acheteur authentifié
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
