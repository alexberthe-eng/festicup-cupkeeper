import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

const eventTypes = [
  {
    id: "festival",
    label: "Festivals, concerts, événements sportifs",
    emoji: "🎵",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "mariage",
    label: "Mariages, anniversaires, fêtes privées",
    emoji: "💍",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "entreprise",
    label: "Entreprises, séminaires, événements B2B",
    emoji: "🏢",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "autre",
    label: "Autres",
    emoji: "🎉",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80",
  },
];

const ConfigurateurSection = () => {
  const [mode, setMode] = useState<"achat" | "location">("achat");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [attendees, setAttendees] = useState(200);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">
            Votre évènements, nos gobelets
          </h2>
          <p className="text-festicup-text-secondary max-w-2xl mx-auto text-sm lg:text-base">
            Calculez votre besoin en 2 minutes. Nous vous recommandons les produits adaptés
            à votre évènement, avec les quantités optimales.
          </p>
        </div>

        {/* Toggle Achat/Location */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-secondary rounded-full p-1">
            <button
              onClick={() => setMode("achat")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                mode === "achat"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Achat
            </button>
            <button
              onClick={() => setMode("location")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                mode === "location"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Location
            </button>
          </div>
        </div>

        {/* Configurator card */}
        <div className="max-w-3xl mx-auto bg-background rounded-2xl shadow-lg border border-border p-6 lg:p-10">
          {/* Type d'événement */}
          <p className="text-sm font-medium text-muted-foreground mb-4">Type d'événement :</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {eventTypes.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                className={`relative rounded-xl overflow-hidden h-28 lg:h-32 group transition-all ${
                  selectedEvent === event.id
                    ? "ring-2 ring-festicup-gold ring-offset-2"
                    : "ring-1 ring-border"
                }`}
              >
                <img
                  src={event.image}
                  alt={event.label}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full px-2">
                  <span className="text-white text-[11px] lg:text-xs text-center font-medium leading-tight">
                    {event.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Nombre de personnes */}
          <p className="text-sm font-medium text-muted-foreground mb-3">Nombre de personnes :</p>
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setAttendees(Math.max(25, attendees - 50))}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Diminuer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={attendees}
              onChange={(e) => setAttendees(Math.max(25, Number(e.target.value)))}
              className="w-24 text-center text-2xl font-bold bg-transparent border-none outline-none font-sans"
              min={25}
            />
            <button
              onClick={() => setAttendees(attendees + 50)}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Augmenter"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* CTA */}
          <Button className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-lg py-6 text-base font-medium">
            Continuer
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ConfigurateurSection;
