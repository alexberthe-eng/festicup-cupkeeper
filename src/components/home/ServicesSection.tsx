import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wine, CalendarDays, Briefcase } from "lucide-react";

const services = [
  {
    icon: Wine,
    title: "Achat",
    description: "Commandez vos gobelets personnalisés en petite ou grande quantité. Idéal pour offrir un souvenir unique.",
    advantages: [
      "Personnalisation complète (logo, texte, couleur)",
      "Qualité premium, fabrication française",
      "Livraison express en 24h",
    ],
    cta: "Découvrir la gamme",
    href: "/produits?type=achat",
  },
  {
    icon: CalendarDays,
    title: "Location",
    description: "Louez vos gobelets pour un événement ponctuel. Économique, écologique et sans souci logistique.",
    advantages: [
      "À partir de 0,28 € / gobelet",
      "Lavage et collecte inclus",
      "Idéal festivals et événements de grande envergure",
    ],
    cta: "Découvrir la gamme",
    href: "/produits?type=location",
  },
  {
    icon: Briefcase,
    title: "Solution PRO",
    description: "Un accompagnement sur mesure pour les grandes entreprises et collectivités. Devis personnalisé et suivi dédié.",
    advantages: [
      "Tarifs dégressifs sur volume",
      "Interlocuteur unique dédié",
      "Aide à la mise en page incluse",
    ],
    cta: "Découvrir la gamme",
    href: "/pro",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-secondary">
      <div className="container px-4">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center text-foreground mb-4">
          Nos services
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Location, achat ou solution sur mesure — nous avons la formule idéale pour votre événement.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-background/50 backdrop-blur-sm border border-border rounded-xl p-8 flex flex-col hover:border-primary/40 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-5">{s.description}</p>
              <ul className="space-y-2 mb-8 flex-1">
                {s.advantages.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span>
                    {a}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                <Link to={s.href}>{s.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
