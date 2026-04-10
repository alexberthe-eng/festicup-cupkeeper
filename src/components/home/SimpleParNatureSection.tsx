import { useState } from "react";

const stepsAchat = [
  {
    num: "1",
    title: "Choisissez vos gobelets",
    desc: "Ainsi que la date de la location et la quantité",
  },
  {
    num: "2",
    title: "Payer en ligne",
    desc: "Caution préautorisée, jamais débitée",
  },
  {
    num: "3",
    title: "Recevez votre colis",
    desc: "Avec étiquette retour incluse",
  },
  {
    num: "4",
    title: "Rappel automatique",
    desc: "2 jours avant la fin de votre location",
  },
  {
    num: "5",
    title: "Déposez le colis",
    desc: "Caution libérée au scan du transporteur",
  },
];

const stepsLocation = [
  {
    num: "1",
    title: "Choisissez vos gobelets",
    desc: "Sélectionnez les modèles et la quantité souhaitée",
  },
  {
    num: "2",
    title: "Configurez votre location",
    desc: "Dates, impression et personnalisation",
  },
  {
    num: "3",
    title: "Recevez votre colis",
    desc: "Livraison express avec étiquette retour",
  },
  {
    num: "4",
    title: "Profitez de votre événement",
    desc: "Des gobelets premium pour tous vos invités",
  },
  {
    num: "5",
    title: "Renvoyez le colis",
    desc: "Retour simple et gratuit",
  },
];

const SimpleParNatureSection = () => {
  const [mode, setMode] = useState<"achat" | "location">("achat");
  const steps = mode === "achat" ? stepsAchat : stepsLocation;

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          {/* Left side */}
          <div className="flex-1">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-8">
              Simple par nature
            </h2>

            {/* Toggle */}
            <div className="inline-flex bg-secondary rounded-full p-1 mb-8">
              <button
                onClick={() => setMode("achat")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  mode === "achat"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Achat
              </button>
              <button
                onClick={() => setMode("location")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  mode === "location"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Location
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.num} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-festicup-gold flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-festicup-gold">{step.num}</span>
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-base">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Image + floating card */}
          <div className="flex-1 relative">
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
                alt="Entrepôt Festicup"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute bottom-6 left-4 right-4 lg:left-6 lg:right-6 bg-background rounded-xl shadow-xl border border-border p-5">
              <p className="font-sans font-semibold text-sm mb-1">
                Votre caution n'est jamais débitée.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Elle est libérée automatiquement dès le premier scan de votre colis retour.
                Aucune démarche nécessaire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleParNatureSection;
