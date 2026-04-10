import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";

const reviews = [
  { name: "Marie L.", rating: 5, text: { fr: "Service impeccable ! Les gobelets étaient de très bonne qualité et la livraison rapide. Je recommande vivement pour tous vos événements.", nl: "Onberispelijke service! De bekers waren van zeer goede kwaliteit en de levering was snel. Ik raad het ten zeerste aan voor al uw evenementen.", en: "Impeccable service! The cups were of very good quality and delivery was fast. Highly recommended for all your events." }, date: "12/03/2025", verified: true, avatar: "🇫🇷" },
  { name: "Thomas D.", rating: 5, text: { fr: "Nous avons commandé pour notre mariage. Le rendu était parfait et le service client très réactif. Merci Festicup !", nl: "We hebben besteld voor onze bruiloft. Het resultaat was perfect en de klantenservice zeer responsief. Bedankt Festicup!", en: "We ordered for our wedding. The result was perfect and the customer service very responsive. Thanks Festicup!" }, date: "28/02/2025", verified: true, avatar: "🇧🇪" },
  { name: "Sophie M.", rating: 5, text: { fr: "Location de gobelets pour notre festival. Tout s'est très bien passé, de la commande au retour. Rapport qualité/prix excellent.", nl: "Huur van bekers voor ons festival. Alles verliep vlot, van bestelling tot retour. Uitstekende prijs-kwaliteitverhouding.", en: "Cup rental for our festival. Everything went smoothly, from order to return. Excellent value for money." }, date: "15/01/2025", verified: true, avatar: "🇫🇷" },
  { name: "Pierre B.", rating: 4, text: { fr: "Très satisfait de la qualité des gobelets. La personnalisation est top et l'équipe est très professionnelle.", nl: "Zeer tevreden over de kwaliteit van de bekers. De personalisatie is top en het team is zeer professioneel.", en: "Very satisfied with the quality of the cups. Customization is great and the team is very professional." }, date: "05/12/2024", verified: true, avatar: "🇧🇪" },
];

const AvisSection = () => {
  const { t, locale } = useI18n();
  const [scrollIndex, setScrollIndex] = useState(0);

  return (
    <section className="py-14 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-2xl lg:text-4xl font-serif font-bold text-center mb-8">{t("avis.title")}</h2>
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 bg-secondary rounded-xl px-5 py-3">
            <div className="text-center">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-festicup-gold">4.8</span>
                <span className="text-xs text-muted-foreground">/5</span>
              </div>
              <div className="flex gap-0.5 mt-0.5">
                {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 fill-festicup-gold text-festicup-gold" />)}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">1 522 {t("avis.reviews")}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-xs font-semibold">{t("avis.certified")}</p>
              <p className="text-[10px] text-muted-foreground">{t("avis.certifiedDesc")}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mb-4">
          <button onClick={() => setScrollIndex(Math.max(0, scrollIndex - 1))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => setScrollIndex(Math.min(reviews.length - 1, scrollIndex + 1))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
          {reviews.map((review, index) => (
            <div key={index} className="snap-start shrink-0 w-[260px] lg:w-[280px] bg-background border border-border rounded-xl p-5">
              <div className="flex items-center gap-0.5 mb-2.5">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-festicup-gold text-festicup-gold" : "text-border"}`} />)}
              </div>
              <p className="text-xs text-foreground mb-3 leading-relaxed line-clamp-4">"{review.text[locale]}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{review.avatar}</span>
                  <span className="text-xs font-medium">{review.name}</span>
                </div>
                {review.verified && <span className="text-[9px] uppercase tracking-wide text-festicup-gold font-medium">{t("avis.verified")}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvisSection;
