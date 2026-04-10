import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const ConfigurateurSection = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"achat" | "location">("achat");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [attendees, setAttendees] = useState(200);

  const eventTypes = [
    { id: "festival", label: t("config.event.festival"), image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80" },
    { id: "mariage", label: t("config.event.wedding"), image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" },
    { id: "entreprise", label: t("config.event.corporate"), image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80" },
    { id: "autre", label: t("config.event.other"), image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80" },
  ];

  return (
    <section className="py-14 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-4xl font-serif font-bold mb-3">{t("config.title")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">{t("config.subtitle")}</p>
        </div>
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-secondary rounded-full p-1">
            <button onClick={() => setMode("achat")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${mode === "achat" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t("simple.achat")}</button>
            <button onClick={() => setMode("location")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${mode === "location" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t("simple.location")}</button>
          </div>
        </div>
        <div className="max-w-2xl mx-auto bg-background rounded-2xl shadow-lg border border-border p-5 lg:p-8">
          <p className="text-xs font-medium text-muted-foreground mb-3">{t("config.eventType")}</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
            {eventTypes.map((event) => (
              <button key={event.id} onClick={() => setSelectedEvent(event.id)} className={`relative rounded-xl overflow-hidden h-24 lg:h-28 group transition-all ${selectedEvent === event.id ? "ring-2 ring-festicup-gold ring-offset-2" : "ring-1 ring-border"}`}>
                <img src={event.image} alt={event.label} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
                <div className="relative z-10 flex items-center justify-center h-full px-2">
                  <span className="text-white text-[10px] lg:text-xs text-center font-medium leading-tight">{event.label}</span>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs font-medium text-muted-foreground mb-3">{t("config.attendees")}</p>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setAttendees(Math.max(25, attendees - 50))} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors" aria-label="-"><Minus className="w-3.5 h-3.5" /></button>
            <input type="number" value={attendees} onChange={(e) => setAttendees(Math.max(25, Number(e.target.value)))} className="w-20 text-center text-xl font-bold bg-transparent border-none outline-none font-sans" min={25} />
            <button onClick={() => setAttendees(attendees + 50)} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors" aria-label="+"><Plus className="w-3.5 h-3.5" /></button>
          </div>
          <Button
            className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-lg h-11 text-sm font-medium"
            onClick={() => {
              const params = new URLSearchParams({ event: selectedEvent || "", attendees: attendees.toString() });
              navigate(attendees > 500 ? `/devis?${params}` : `/${mode}?${params}`);
            }}
          >
            {t("config.continue")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ConfigurateurSection;
