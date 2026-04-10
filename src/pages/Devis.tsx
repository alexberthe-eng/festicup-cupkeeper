import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check, ChevronRight, Minus, Plus, Trash2, CalendarIcon, Send, ArrowLeft, ArrowRight, Building2, PartyPopper, Users, Music } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  products,
  formatPrice,
  getPriceTTC,
  getPriceForQty,
  type Product,
} from "@/data/products";

// ─── Types ───────────────────────────────────────────────────

type QuoteItem = {
  productId: string;
  quantity: number;
  color: string;
  customText: string;
};

type EventInfo = {
  eventType: string;
  eventName: string;
  eventDate: Date | undefined;
  attendees: string;
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  message: string;
};

const STEPS = [
  { num: 1, label: "Produits" },
  { num: 2, label: "Événement" },
  { num: 3, label: "Récapitulatif" },
  { num: 4, label: "Confirmation" },
];

const eventTypes = [
  { id: "festival", label: "Festival / Concert", icon: Music },
  { id: "mariage", label: "Mariage / Fête", icon: PartyPopper },
  { id: "entreprise", label: "Entreprise / Séminaire", icon: Building2 },
  { id: "autre", label: "Autre événement", icon: Users },
];

// ─── Main Page ───────────────────────────────────────────────

const Devis = () => {
  const [searchParams] = useSearchParams();
  const preselectedSlug = searchParams.get("product");
  const preselectedQty = parseInt(searchParams.get("qty") || "0");

  const [step, setStep] = useState(1);

  // Step 1 state
  const [items, setItems] = useState<QuoteItem[]>(() => {
    if (preselectedSlug) {
      const p = products.find((p) => p.slug === preselectedSlug);
      if (p) return [{ productId: p.id, quantity: preselectedQty || 500, color: p.colors[0] || "", customText: "" }];
    }
    return [];
  });

  // Step 2 state
  const [eventInfo, setEventInfo] = useState<EventInfo>({
    eventType: "",
    eventName: "",
    eventDate: undefined,
    attendees: "",
    company: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    message: "",
  });

  const canGoStep2 = items.length > 0 && items.every((i) => i.quantity >= 25);
  const canGoStep3 =
    eventInfo.eventType !== "" &&
    eventInfo.contactName.trim() !== "" &&
    eventInfo.contactEmail.trim() !== "" &&
    eventInfo.contactPhone.trim() !== "";

  const goNext = () => setStep((s) => Math.min(4, s + 1));
  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="bg-background min-h-screen">
        {/* Hero */}
        <section className="bg-festicup-dark py-8 lg:py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <span className="text-[10px] uppercase tracking-[0.2em] text-festicup-gold font-semibold mb-1 block">
              Demande de devis
            </span>
            <h1 className="text-2xl lg:text-4xl font-serif font-bold text-white">
              Configurez votre demande
            </h1>
            <p className="text-sm text-white/50 mt-2 max-w-lg">
              Remplissez les informations ci-dessous et recevez une offre personnalisée sous 24h ouvrées.
            </p>
          </div>
        </section>

        {/* Stepper */}
        <div className="border-b border-border bg-background sticky top-14 lg:top-[72px] z-40">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto py-4">
              {STEPS.map((s, i) => (
                <div key={s.num} className="flex items-center gap-0">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                        step > s.num
                          ? "bg-festicup-gold text-foreground"
                          : step === s.num
                          ? "bg-foreground text-background"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium hidden sm:block",
                        step >= s.num ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "w-8 lg:w-16 h-px mx-2",
                        step > s.num ? "bg-festicup-gold" : "bg-border"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Steps content */}
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-10">
          <div className="max-w-3xl mx-auto">
            {step === 1 && (
              <Step1Products items={items} setItems={setItems} />
            )}
            {step === 2 && (
              <Step2Event eventInfo={eventInfo} setEventInfo={setEventInfo} />
            )}
            {step === 3 && (
              <Step3Summary items={items} eventInfo={eventInfo} />
            )}
            {step === 4 && <Step4Confirmation />}

            {/* Navigation */}
            {step < 4 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={goPrev}
                  disabled={step === 1}
                  className="gap-2 rounded-lg"
                >
                  <ArrowLeft className="w-4 h-4" /> Précédent
                </Button>
                <Button
                  onClick={goNext}
                  disabled={
                    (step === 1 && !canGoStep2) ||
                    (step === 2 && !canGoStep3)
                  }
                  className={cn(
                    "gap-2 rounded-lg",
                    step === 3
                      ? "bg-festicup-gold hover:bg-festicup-gold-dark text-foreground"
                      : "bg-foreground hover:bg-foreground/90 text-background"
                  )}
                >
                  {step === 3 ? (
                    <>
                      <Send className="w-4 h-4" /> Envoyer la demande
                    </>
                  ) : (
                    <>
                      Suivant <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

// ─── Step 1: Sélection produits ──────────────────────────────

const Step1Products = ({
  items,
  setItems,
}: {
  items: QuoteItem[];
  setItems: React.Dispatch<React.SetStateAction<QuoteItem[]>>;
}) => {
  const addProduct = (product: Product) => {
    if (items.find((i) => i.productId === product.id)) return;
    setItems([
      ...items,
      { productId: product.id, quantity: 500, color: product.colors[0] || "", customText: "" },
    ]);
  };

  const removeItem = (productId: string) => {
    setItems(items.filter((i) => i.productId !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    setItems(items.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(25, qty) } : i)));
  };

  const updateColor = (productId: string, color: string) => {
    setItems(items.map((i) => (i.productId === productId ? { ...i, color } : i)));
  };

  const updateText = (productId: string, text: string) => {
    setItems(items.map((i) => (i.productId === productId ? { ...i, customText: text } : i)));
  };

  return (
    <div>
      <h2 className="text-xl font-serif font-bold mb-1">Sélectionnez vos produits</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Ajoutez les gobelets souhaités et configurez les quantités.
      </p>

      {/* Selected items */}
      {items.length > 0 && (
        <div className="space-y-4 mb-8">
          {items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            const unitPrice = getPriceForQty(product, item.quantity);
            return (
              <div key={item.productId} className="border border-border rounded-xl p-4">
                <div className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">{product.name}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          {product.gamme === "ecocup" ? "Gamme Ecocup" : "Gamme Prestige"} · {product.capacity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-muted-foreground hover:text-destructive p-1"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Qty */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQty(item.productId, item.quantity - 50)}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQty(item.productId, parseInt(e.target.value) || 25)}
                        className="w-16 text-center text-sm font-bold bg-transparent border-none outline-none"
                        min={25}
                      />
                      <button
                        onClick={() => updateQty(item.productId, item.quantity + 50)}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <span className="text-xs text-muted-foreground ml-2">
                        × {formatPrice(unitPrice)} = <span className="font-semibold text-foreground">{formatPrice(unitPrice * item.quantity)} HT</span>
                      </span>
                    </div>

                    {/* Color + text */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">Couleur :</span>
                        {product.colors.map((c) => (
                          <button
                            key={c}
                            onClick={() => updateColor(item.productId, c)}
                            className={cn(
                              "w-5 h-5 rounded-full border-2",
                              item.color === c ? "border-festicup-gold" : "border-border"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={item.customText}
                          onChange={(e) => updateText(item.productId, e.target.value)}
                          placeholder="Texte perso..."
                          className="w-full h-7 px-2 text-[11px] rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-festicup-gold/50"
                          maxLength={30}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product picker */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          Ajouter un produit
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products
            .filter((p) => !items.find((i) => i.productId === p.id))
            .map((product) => (
              <button
                key={product.id}
                onClick={() => addProduct(product)}
                className="group border border-border rounded-xl overflow-hidden hover:border-festicup-gold transition-colors text-left"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-2.5">
                  <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                    {product.gamme === "ecocup" ? "Ecocup" : "Prestige"} · {product.capacity}
                  </p>
                  <p className="text-xs font-medium mt-0.5 group-hover:text-festicup-gold transition-colors">
                    {product.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    dès {formatPrice(product.priceTiers[product.priceTiers.length - 1].priceHT)}/u
                  </p>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

// ─── Step 2: Infos événement ─────────────────────────────────

const Step2Event = ({
  eventInfo,
  setEventInfo,
}: {
  eventInfo: EventInfo;
  setEventInfo: React.Dispatch<React.SetStateAction<EventInfo>>;
}) => {
  const update = (key: keyof EventInfo, value: string | Date | undefined) =>
    setEventInfo((prev) => ({ ...prev, [key]: value }));

  return (
    <div>
      <h2 className="text-xl font-serif font-bold mb-1">Votre événement</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Décrivez votre événement pour recevoir une offre adaptée.
      </p>

      {/* Event type */}
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2">
        Type d'événement <span className="text-destructive">*</span>
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {eventTypes.map((et) => {
          const Icon = et.icon;
          return (
            <button
              key={et.id}
              onClick={() => update("eventType", et.id)}
              className={cn(
                "flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all text-center",
                eventInfo.eventType === et.id
                  ? "border-festicup-gold bg-festicup-gold/5"
                  : "border-border hover:border-muted-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", eventInfo.eventType === et.id ? "text-festicup-gold" : "text-muted-foreground")} />
              <span className="text-xs font-medium">{et.label}</span>
            </button>
          );
        })}
      </div>

      {/* Event details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Nom de l'événement</label>
          <Input
            value={eventInfo.eventName}
            onChange={(e) => update("eventName", e.target.value)}
            placeholder="Ex: Festival de l'été 2025"
            className="h-10 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Date prévue</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-10 justify-start text-left text-sm font-normal",
                  !eventInfo.eventDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {eventInfo.eventDate
                  ? format(eventInfo.eventDate, "dd MMMM yyyy", { locale: fr })
                  : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={eventInfo.eventDate}
                onSelect={(d) => update("eventDate", d)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Nombre de participants estimé</label>
          <Input
            value={eventInfo.attendees}
            onChange={(e) => update("attendees", e.target.value)}
            placeholder="Ex: 500"
            type="number"
            className="h-10 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Société / Organisation</label>
          <Input
            value={eventInfo.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Nom de votre société"
            className="h-10 text-sm"
          />
        </div>
      </div>

      {/* Contact info */}
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2 mt-8">
        Vos coordonnées
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Nom complet <span className="text-destructive">*</span>
          </label>
          <Input
            value={eventInfo.contactName}
            onChange={(e) => update("contactName", e.target.value)}
            placeholder="Jean Dupont"
            className="h-10 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Email <span className="text-destructive">*</span>
          </label>
          <Input
            value={eventInfo.contactEmail}
            onChange={(e) => update("contactEmail", e.target.value)}
            placeholder="jean@exemple.be"
            type="email"
            className="h-10 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Téléphone <span className="text-destructive">*</span>
          </label>
          <Input
            value={eventInfo.contactPhone}
            onChange={(e) => update("contactPhone", e.target.value)}
            placeholder="+32 4 XX XX XX XX"
            type="tel"
            className="h-10 text-sm"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Message / Précisions</label>
        <textarea
          value={eventInfo.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Besoins spécifiques, personnalisation souhaitée, contraintes..."
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-festicup-gold/50 resize-none"
        />
      </div>
    </div>
  );
};

// ─── Step 3: Récapitulatif ───────────────────────────────────

const Step3Summary = ({
  items,
  eventInfo,
}: {
  items: QuoteItem[];
  eventInfo: EventInfo;
}) => {
  const totalHT = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + getPriceForQty(product, item.quantity) * item.quantity;
    }, 0);
  }, [items]);

  const totalTTC = getPriceTTC(totalHT);
  const eventLabel = eventTypes.find((e) => e.id === eventInfo.eventType)?.label || "";

  return (
    <div>
      <h2 className="text-xl font-serif font-bold mb-1">Récapitulatif</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Vérifiez votre demande avant envoi.
      </p>

      {/* Products summary */}
      <div className="border border-border rounded-xl p-5 mb-5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-3">
          Produits sélectionnés
        </p>
        <div className="space-y-3">
          {items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            const unitPrice = getPriceForQty(product, item.quantity);
            return (
              <div key={item.productId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.quantity} unités × {formatPrice(unitPrice)}
                      {item.customText && ` · "${item.customText}"`}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold">{formatPrice(unitPrice * item.quantity)}</span>
              </div>
            );
          })}
        </div>
        <div className="border-t border-border mt-4 pt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Total estimé</span>
          <div className="text-right">
            <span className="text-lg font-bold text-festicup-gold">{formatPrice(totalHT)} HT</span>
            <p className="text-[10px] text-muted-foreground">soit {formatPrice(totalTTC)} TTC</p>
          </div>
        </div>
      </div>

      {/* Event summary */}
      <div className="border border-border rounded-xl p-5 mb-5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-3">
          Événement
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            { label: "Type", value: eventLabel },
            { label: "Nom", value: eventInfo.eventName || "—" },
            { label: "Date", value: eventInfo.eventDate ? format(eventInfo.eventDate, "dd/MM/yyyy") : "—" },
            { label: "Participants", value: eventInfo.attendees || "—" },
            { label: "Société", value: eventInfo.company || "—" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between bg-secondary/40 rounded-lg px-3 py-2">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium">{row.value}</span>
            </div>
          ))}
        </div>
        {eventInfo.message && (
          <div className="mt-3 bg-secondary/40 rounded-lg px-3 py-2">
            <span className="text-[10px] text-muted-foreground block mb-1">Message</span>
            <p className="text-xs">{eventInfo.message}</p>
          </div>
        )}
      </div>

      {/* Contact summary */}
      <div className="border border-border rounded-xl p-5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-3">
          Contact
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-secondary/40 rounded-lg px-3 py-2">
            <span className="text-muted-foreground block text-[10px]">Nom</span>
            <span className="font-medium">{eventInfo.contactName}</span>
          </div>
          <div className="bg-secondary/40 rounded-lg px-3 py-2">
            <span className="text-muted-foreground block text-[10px]">Email</span>
            <span className="font-medium">{eventInfo.contactEmail}</span>
          </div>
          <div className="bg-secondary/40 rounded-lg px-3 py-2">
            <span className="text-muted-foreground block text-[10px]">Téléphone</span>
            <span className="font-medium">{eventInfo.contactPhone}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 bg-festicup-gold/10 border border-festicup-gold/20 rounded-lg px-4 py-3">
        <p className="text-xs text-center">
          En cliquant sur <strong>"Envoyer la demande"</strong>, un chargé de clientèle dédié vous contactera sous <strong>24h ouvrées</strong> avec une offre personnalisée.
        </p>
      </div>
    </div>
  );
};

// ─── Step 4: Confirmation ────────────────────────────────────

const Step4Confirmation = () => {
  return (
    <div className="text-center py-10">
      <div className="w-16 h-16 rounded-full bg-festicup-gold/20 flex items-center justify-center mx-auto mb-5">
        <Check className="w-8 h-8 text-festicup-gold" />
      </div>
      <h2 className="text-2xl font-serif font-bold mb-2">Demande envoyée !</h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
        Votre demande de devis a bien été enregistrée. Un chargé de clientèle dédié vous contactera
        sous <strong>24 heures ouvrées</strong> avec une offre personnalisée.
      </p>
      <p className="text-xs text-muted-foreground mb-8">
        Un email de confirmation a été envoyé à votre adresse.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/">
          <Button variant="outline" className="rounded-lg px-6">
            Retour à l'accueil
          </Button>
        </Link>
        <Link to="/achat">
          <Button className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-lg px-6">
            Continuer mes achats
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Devis;
