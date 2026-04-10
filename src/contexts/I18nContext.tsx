import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Locale = "fr" | "nl" | "en";

export const LOCALES: { value: Locale; label: string; flag: string }[] = [
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "nl", label: "Nederlands", flag: "🇧🇪" },
  { value: "en", label: "English", flag: "🇬🇧" },
];

// PrestaShop language IDs mapped to our locales
export const PS_LANG_MAP: Record<Locale, string> = {
  fr: "1",
  nl: "3",
  en: "2",
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  psLangId: string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem("festicup-lang") as Locale | null;
    if (stored && ["fr", "nl", "en"].includes(stored)) return stored;
    const browserLang = navigator.language.split("-")[0];
    if (browserLang === "nl") return "nl";
    if (browserLang === "en") return "en";
    return "fr";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("festicup-lang", l);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[locale] || entry.fr || key;
    },
    [locale]
  );

  const psLangId = PS_LANG_MAP[locale];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, psLangId }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

// ─── Translation dictionary ─────────────────────────────────
type TranslationEntry = Record<Locale, string>;

const translations: Record<string, TranslationEntry> = {
  // ── Header / Nav ──
  "nav.home": { fr: "Accueil", nl: "Home", en: "Home" },
  "nav.achat": { fr: "Achat", nl: "Aankoop", en: "Purchase" },
  "nav.location": { fr: "Location", nl: "Verhuur", en: "Rental" },
  "nav.pro": { fr: "Nos solutions PRO", nl: "Onze PRO oplossingen", en: "Our PRO solutions" },
  "nav.devis": { fr: "Demander un devis", nl: "Offerte aanvragen", en: "Request a quote" },
  "nav.compte": { fr: "Mon compte", nl: "Mijn account", en: "My account" },

  // ── Announcement bar ──
  "announce.shipping": {
    fr: "🚚 Livraison gratuite dès 3 packs commandés",
    nl: "🚚 Gratis levering vanaf 3 bestelde packs",
    en: "🚚 Free shipping from 3 packs ordered",
  },
  "announce.minimum": {
    fr: "Commande minimum dès 25 unités",
    nl: "Minimale bestelling vanaf 25 stuks",
    en: "Minimum order from 25 units",
  },

  // ── Hero ──
  "hero.title.line1": { fr: "Le leader belge", nl: "De Belgische leider", en: "The Belgian leader" },
  "hero.title.line2": { fr: "de la vente et", nl: "in de verkoop en", en: "in sales and" },
  "hero.title.line3": { fr: "location", nl: "verhuur", en: "rental" },
  "hero.title.line4": { fr: "de gobelets", nl: "van herbruikbare", en: "of reusable" },
  "hero.title.line5": { fr: "réutilisables", nl: "bekers", en: "cups" },
  "hero.subtitle": {
    fr: "Achat et location de gobelets réutilisables et verres incassables premium.",
    nl: "Aankoop en verhuur van herbruikbare bekers en premium onbreekbare glazen.",
    en: "Purchase and rental of reusable cups and premium unbreakable glasses.",
  },
  "hero.cta": { fr: "Découvrir la gamme", nl: "Ontdek het assortiment", en: "Discover the range" },
  "hero.img.alt": {
    fr: "Foule en fête avec gobelets réutilisables",
    nl: "Feestende menigte met herbruikbare bekers",
    en: "Celebrating crowd with reusable cups",
  },

  // ── Stats / Chiffres ──
  "stats.experience": { fr: "années d'expérience", nl: "jaar ervaring", en: "years experience" },
  "stats.cleaned": { fr: "gobelets nettoyés par jour", nl: "bekers gereinigd per dag", en: "cups cleaned per day" },
  "stats.team": { fr: "professionnels à vos côtés", nl: "professionals aan uw zijde", en: "professionals at your side" },
  "stats.available": { fr: "gobelets disponibles", nl: "bekers beschikbaar", en: "cups available" },
  "stats.order": { fr: "Commande", nl: "Bestelling", en: "Order" },
  "stats.from25": { fr: "dès 25 unités", nl: "vanaf 25 stuks", en: "from 25 units" },
  "stats.custom": {
    fr: "Gobelets réutilisables personnalisés\nà votre image et vos couleurs",
    nl: "Herbruikbare bekers gepersonaliseerd\nnaar uw beeld en kleuren",
    en: "Reusable cups customized\nto your image and colors",
  },

  // ── Gammes ──
  "gammes.ecocup.tag": { fr: "La gamme Ecocup", nl: "Het Ecocup assortiment", en: "The Ecocup range" },
  "gammes.ecocup.desc": {
    fr: "Gobelet réutilisable standard — essentiel de l'événement",
    nl: "Standaard herbruikbare beker — essentieel voor elk evenement",
    en: "Standard reusable cup — event essential",
  },
  "gammes.ecocup.title": { fr: "Gamme Ecocup", nl: "Ecocup assortiment", en: "Ecocup Range" },
  "gammes.ecocup.info": {
    fr: "5 références, dès 0,76€ pièce — Achat et location",
    nl: "5 referenties, vanaf €0,76/stuk — Aankoop en verhuur",
    en: "5 references, from €0.76/piece — Purchase and rental",
  },
  "gammes.prestige.tag": { fr: "La gamme Prestige", nl: "Het Prestige assortiment", en: "The Prestige range" },
  "gammes.prestige.desc": {
    fr: "Verres premium incassables — L'élégance sans compromis",
    nl: "Premium onbreekbare glazen — Elegantie zonder compromissen",
    en: "Premium unbreakable glasses — Elegance without compromise",
  },
  "gammes.prestige.title": { fr: "Gamme Prestige", nl: "Prestige assortiment", en: "Prestige Range" },
  "gammes.prestige.info": {
    fr: "12 références, dès 2,95€ pièce — Achat et location",
    nl: "12 referenties, vanaf €2,95/stuk — Aankoop en verhuur",
    en: "12 references, from €2.95/piece — Purchase and rental",
  },
  "gammes.cta.ecocup": { fr: "Découvrir la gamme", nl: "Ontdek het assortiment", en: "Discover the range" },
  "gammes.cta.prestige": { fr: "Découvrir la gamme", nl: "Ontdek het assortiment", en: "Discover the range" },

  // ── Reassurance ──
  "reassurance.france": { fr: "100% made in France", nl: "100% made in France", en: "100% made in France" },
  "reassurance.france.desc": {
    fr: "Fabrication et personnalisation de vos gobelets en France",
    nl: "Fabricage en personalisatie van uw bekers in Frankrijk",
    en: "Manufacturing and customization of your cups in France",
  },
  "reassurance.choice": { fr: "Large choix de gamme", nl: "Groot assortiment", en: "Wide range of choices" },
  "reassurance.choice.desc": {
    fr: "Des gobelets adaptés à tous types d'événements",
    nl: "Bekers aangepast aan elk type evenement",
    en: "Cups adapted to all types of events",
  },
  "reassurance.dedicated": { fr: "Chargé de client dédié", nl: "Toegewijd contactpersoon", en: "Dedicated account manager" },
  "reassurance.dedicated.desc": {
    fr: "Un interlocuteur unique pour votre projet",
    nl: "Eén aanspreekpunt voor uw project",
    en: "A single point of contact for your project",
  },
  "reassurance.min": { fr: "Commande dès 25 unités", nl: "Bestelling vanaf 25 stuks", en: "Order from 25 units" },
  "reassurance.min.desc": {
    fr: "Minimum de commande accessible pour tous",
    nl: "Toegankelijke minimale bestelling voor iedereen",
    en: "Accessible minimum order for everyone",
  },

  // ── Simple par nature ──
  "simple.title": { fr: "Simple par nature", nl: "Eenvoudig van nature", en: "Simple by nature" },
  "simple.achat": { fr: "Achat", nl: "Aankoop", en: "Purchase" },
  "simple.location": { fr: "Location", nl: "Verhuur", en: "Rental" },
  "simple.caution.title": {
    fr: "Votre caution n'est jamais débitée.",
    nl: "Uw borg wordt nooit afgeschreven.",
    en: "Your deposit is never charged.",
  },
  "simple.caution.desc": {
    fr: "Elle est libérée automatiquement dès le premier scan de votre colis retour. Aucune démarche nécessaire.",
    nl: "Het wordt automatisch vrijgegeven bij de eerste scan van uw retourpakket. Geen actie nodig.",
    en: "It is automatically released upon the first scan of your return package. No action needed.",
  },

  // Steps Achat
  "simple.achat.step1.title": { fr: "Choisissez vos gobelets", nl: "Kies uw bekers", en: "Choose your cups" },
  "simple.achat.step1.desc": { fr: "Ainsi que la date de la location et la quantité", nl: "Evenals de huurdatum en hoeveelheid", en: "As well as rental date and quantity" },
  "simple.achat.step2.title": { fr: "Payer en ligne", nl: "Online betalen", en: "Pay online" },
  "simple.achat.step2.desc": { fr: "Caution préautorisée, jamais débitée", nl: "Vooraf geautoriseerde borg, nooit afgeschreven", en: "Pre-authorized deposit, never charged" },
  "simple.achat.step3.title": { fr: "Recevez votre colis", nl: "Ontvang uw pakket", en: "Receive your package" },
  "simple.achat.step3.desc": { fr: "Avec étiquette retour incluse", nl: "Met retourlabel inbegrepen", en: "With return label included" },
  "simple.achat.step4.title": { fr: "Rappel automatique", nl: "Automatische herinnering", en: "Automatic reminder" },
  "simple.achat.step4.desc": { fr: "2 jours avant la fin de votre location", nl: "2 dagen voor het einde van uw huur", en: "2 days before your rental ends" },
  "simple.achat.step5.title": { fr: "Déposez le colis", nl: "Lever het pakket in", en: "Drop off the package" },
  "simple.achat.step5.desc": { fr: "Caution libérée au scan du transporteur", nl: "Borg vrijgegeven bij scan van de vervoerder", en: "Deposit released upon carrier scan" },

  // Steps Location
  "simple.location.step1.title": { fr: "Choisissez vos gobelets", nl: "Kies uw bekers", en: "Choose your cups" },
  "simple.location.step1.desc": { fr: "Sélectionnez les modèles et la quantité souhaitée", nl: "Selecteer de modellen en gewenste hoeveelheid", en: "Select models and desired quantity" },
  "simple.location.step2.title": { fr: "Configurez votre location", nl: "Configureer uw verhuur", en: "Configure your rental" },
  "simple.location.step2.desc": { fr: "Dates, impression et personnalisation", nl: "Data, druk en personalisatie", en: "Dates, printing and customization" },
  "simple.location.step3.title": { fr: "Recevez votre colis", nl: "Ontvang uw pakket", en: "Receive your package" },
  "simple.location.step3.desc": { fr: "Livraison express avec étiquette retour", nl: "Express levering met retourlabel", en: "Express delivery with return label" },
  "simple.location.step4.title": { fr: "Profitez de votre événement", nl: "Geniet van uw evenement", en: "Enjoy your event" },
  "simple.location.step4.desc": { fr: "Des gobelets premium pour tous vos invités", nl: "Premium bekers voor al uw gasten", en: "Premium cups for all your guests" },
  "simple.location.step5.title": { fr: "Renvoyez le colis", nl: "Stuur het pakket terug", en: "Send back the package" },
  "simple.location.step5.desc": { fr: "Retour simple et gratuit", nl: "Eenvoudige en gratis retour", en: "Simple and free return" },

  // ── Configurateur ──
  "config.title": { fr: "Votre évènement, nos gobelets", nl: "Uw evenement, onze bekers", en: "Your event, our cups" },
  "config.subtitle": {
    fr: "Nous vous recommandons les produits adaptés à votre évènement, avec les quantités optimales.",
    nl: "Wij raden u de producten aan die passen bij uw evenement, met de optimale hoeveelheden.",
    en: "We recommend products suited to your event, with optimal quantities.",
  },
  "config.eventType": { fr: "Type d'événement :", nl: "Type evenement:", en: "Event type:" },
  "config.attendees": { fr: "Nombre de personnes :", nl: "Aantal personen:", en: "Number of attendees:" },
  "config.continue": { fr: "Continuer", nl: "Verder", en: "Continue" },
  "config.event.festival": {
    fr: "Festivals, concerts, événements sportifs",
    nl: "Festivals, concerten, sportevenementen",
    en: "Festivals, concerts, sports events",
  },
  "config.event.wedding": {
    fr: "Mariages, anniversaires, fêtes privées",
    nl: "Bruiloften, verjaardagen, privéfeesten",
    en: "Weddings, birthdays, private parties",
  },
  "config.event.corporate": {
    fr: "Entreprises, séminaires, événements B2B",
    nl: "Bedrijven, seminars, B2B-evenementen",
    en: "Companies, seminars, B2B events",
  },
  "config.event.other": { fr: "Autres", nl: "Andere", en: "Other" },

  // ── Avis ──
  "avis.title": { fr: "Ils nous font confiance", nl: "Zij vertrouwen ons", en: "They trust us" },
  "avis.reviews": { fr: "avis", nl: "beoordelingen", en: "reviews" },
  "avis.verified": { fr: "Vérifié", nl: "Geverifieerd", en: "Verified" },
  "avis.certified": { fr: "Avis Garantis", nl: "Gegarandeerde beoordelingen", en: "Guaranteed Reviews" },
  "avis.certifiedDesc": { fr: "Avis clients certifiés", nl: "Gecertificeerde klantbeoordelingen", en: "Certified customer reviews" },

  // ── FAQ ──
  "faq.title": { fr: "Questions et réponses", nl: "Vragen en antwoorden", en: "Questions and answers" },
  "faq.allQuestions": { fr: "Voir toutes les questions", nl: "Bekijk alle vragen", en: "View all questions" },

  // ── Catalog ──
  "catalog.achat.title": { fr: "Achetez vos gobelets réutilisables", nl: "Koop uw herbruikbare bekers", en: "Buy your reusable cups" },
  "catalog.location.title": { fr: "Louez vos gobelets réutilisables", nl: "Huur uw herbruikbare bekers", en: "Rent your reusable cups" },
  "catalog.achat.desc": {
    fr: "Gobelets réutilisables personnalisés pour tous vos événements. Prix dégressifs, commande dès 25 unités. 100% made in France.",
    nl: "Gepersonaliseerde herbruikbare bekers voor al uw evenementen. Degressieve prijzen, bestelling vanaf 25 stuks. 100% made in France.",
    en: "Customized reusable cups for all your events. Degressive pricing, order from 25 units. 100% made in France.",
  },
  "catalog.location.desc": {
    fr: "Location de gobelets personnalisés pour vos événements. Caution préautorisée, jamais débitée. Retour simple et gratuit.",
    nl: "Verhuur van gepersonaliseerde bekers voor uw evenementen. Vooraf geautoriseerde borg, nooit afgeschreven. Eenvoudige en gratis retour.",
    en: "Rental of customized cups for your events. Pre-authorized deposit, never charged. Simple and free return.",
  },
  "catalog.live": { fr: "Données en direct depuis PrestaShop", nl: "Live data vanuit PrestaShop", en: "Live data from PrestaShop" },
  "catalog.filter.gamme": { fr: "Gamme", nl: "Assortiment", en: "Range" },
  "catalog.filter.all": { fr: "Toutes les gammes", nl: "Alle assortimenten", en: "All ranges" },
  "catalog.filter.capacity": { fr: "Contenance", nl: "Inhoud", en: "Capacity" },
  "catalog.filter.allCapacities": { fr: "Toutes", nl: "Alle", en: "All" },
  "catalog.results": { fr: "produit(s) trouvé(s)", nl: "product(en) gevonden", en: "product(s) found" },
  "catalog.noResults": { fr: "Aucun produit ne correspond à vos critères.", nl: "Geen producten gevonden voor uw criteria.", en: "No products match your criteria." },
  "catalog.reset": { fr: "Réinitialiser les filtres", nl: "Filters resetten", en: "Reset filters" },
  "catalog.madeInFrance": { fr: "Made in France", nl: "Made in France", en: "Made in France" },
  "catalog.madeInFrance.desc": { fr: "Fabrication française", nl: "Franse fabricage", en: "French manufacturing" },
  "catalog.from25": { fr: "Dès 25 unités", nl: "Vanaf 25 stuks", en: "From 25 units" },
  "catalog.from25.desc": { fr: "Commande minimum accessible", nl: "Toegankelijke minimale bestelling", en: "Accessible minimum order" },
  "catalog.express": { fr: "Livraison express", nl: "Express levering", en: "Express delivery" },
  "catalog.express.desc": { fr: "En 24h partout en Belgique", nl: "Binnen 24u in heel België", en: "Within 24h across Belgium" },
  "catalog.degressive": { fr: "Prix dégressifs", nl: "Degressieve prijzen", en: "Degressive pricing" },
  "catalog.degressive.desc": { fr: "Plus vous commandez, moins c'est cher", nl: "Hoe meer u bestelt, hoe goedkoper", en: "The more you order, the cheaper it gets" },
  "catalog.caution": { fr: "Caution sécurisée", nl: "Beveiligde borg", en: "Secured deposit" },
  "catalog.caution.desc": { fr: "Jamais débitée, libérée au retour", nl: "Nooit afgeschreven, vrijgegeven bij retour", en: "Never charged, released on return" },

  // ── Product card ──
  "card.gamme.ecocup": { fr: "Gamme Ecocup", nl: "Ecocup assortiment", en: "Ecocup Range" },
  "card.gamme.prestige": { fr: "Gamme Prestige", nl: "Prestige assortiment", en: "Prestige Range" },
  "card.customizable": { fr: "Personnalisable", nl: "Personaliseerbaar", en: "Customizable" },
  "card.from": { fr: "dès", nl: "vanaf", en: "from" },
  "card.perPiece": { fr: "HT / pièce", nl: "excl. / stuk", en: "excl. / piece" },
  "card.perDay": { fr: "HT / pièce / jour", nl: "excl. / stuk / dag", en: "excl. / piece / day" },
  "card.incl": { fr: "soit", nl: "ofwel", en: "i.e." },
  "card.ttc": { fr: "TTC", nl: "incl.", en: "incl." },
  "card.degressive": { fr: "📉 Prix dégressif", nl: "📉 Degressieve prijs", en: "📉 Degressive pricing" },
  "card.minimum": { fr: "Minimum", nl: "Minimum", en: "Minimum" },
  "card.units": { fr: "unités", nl: "stuks", en: "units" },

  // ── Product detail ──
  "product.notFound": { fr: "Produit introuvable", nl: "Product niet gevonden", en: "Product not found" },
  "product.backToCatalog": { fr: "Retour au catalogue", nl: "Terug naar catalogus", en: "Back to catalog" },
  "product.delivery": { fr: "Livraison 24h", nl: "Levering 24u", en: "24h delivery" },
  "product.freeReturn": { fr: "Retour gratuit", nl: "Gratis retour", en: "Free return" },
  "product.securePay": { fr: "Paiement sécurisé", nl: "Veilige betaling", en: "Secure payment" },
  "product.color": { fr: "Couleur", nl: "Kleur", en: "Color" },
  "product.customization": { fr: "Personnalisation", nl: "Personalisatie", en: "Customization" },
  "product.customText": { fr: "Texte personnalisé (optionnel)", nl: "Gepersonaliseerde tekst (optioneel)", en: "Custom text (optional)" },
  "product.customPlaceholder": { fr: "Nom de votre événement...", nl: "Naam van uw evenement...", en: "Name of your event..." },
  "product.addLogo": { fr: "Ajouter mon logo", nl: "Mijn logo toevoegen", en: "Add my logo" },
  "product.logoHint": { fr: "fichier à fournir après commande", nl: "bestand te leveren na bestelling", en: "file to provide after order" },
  "product.quantity": { fr: "Quantité", nl: "Aantal", en: "Quantity" },
  "product.priceByVariant": { fr: "Prix par déclinaison", nl: "Prijs per variant", en: "Price per variant" },
  "product.priceTiers": { fr: "Grille tarifaire — Prix dégressif", nl: "Prijslijst — Degressieve prijs", en: "Pricing grid — Degressive pricing" },
  "product.units": { fr: "unités", nl: "stuks", en: "units" },
  "product.nearQuoteTitle": { fr: "Vous approchez du seuil devis", nl: "U nadert de offertegrens", en: "Approaching quote threshold" },
  "product.nearQuoteDesc": { fr: "À partir de", nl: "Vanaf", en: "From" },
  "product.quoteMode": { fr: "Mode devis activé", nl: "Offertemodus geactiveerd", en: "Quote mode activated" },
  "product.quoteModeDesc": { fr: "Un chargé de clientèle dédié vous accompagnera. Offre personnalisée sous 24h.", nl: "Een toegewijd contactpersoon begeleidt u. Gepersonaliseerd aanbod binnen 24u.", en: "A dedicated account manager will assist you. Personalized offer within 24h." },
  "product.totalLocation": { fr: "Total location", nl: "Totaal verhuur", en: "Total rental" },
  "product.totalEstimated": { fr: "Total estimé", nl: "Geschat totaal", en: "Estimated total" },
  "product.ie": { fr: "soit", nl: "ofwel", en: "i.e." },
  "product.piece": { fr: "pièce", nl: "stuk", en: "piece" },
  "product.day": { fr: "jour", nl: "dag", en: "day" },
  "product.requestQuote": { fr: "Demander un devis personnalisé", nl: "Gepersonaliseerde offerte aanvragen", en: "Request a personalized quote" },
  "product.securePayment": { fr: "Paiement sécurisé · 3x/4x sans frais avec Alma", nl: "Veilige betaling · 3x/4x zonder kosten met Alma", en: "Secure payment · 3x/4x interest-free with Alma" },
  "product.specs": { fr: "Caractéristiques", nl: "Kenmerken", en: "Features" },
  "product.specCapacity": { fr: "Contenance", nl: "Inhoud", en: "Capacity" },
  "product.specGamme": { fr: "Gamme", nl: "Assortiment", en: "Range" },
  "product.specMaterial": { fr: "Matière", nl: "Materiaal", en: "Material" },
  "product.specCustom": { fr: "Personnalisable", nl: "Personaliseerbaar", en: "Customizable" },
  "product.specWashes": { fr: "Lavages", nl: "Wasbeurten", en: "Washes" },
  "product.specOrigin": { fr: "Fabrication", nl: "Fabricage", en: "Manufacturing" },
  "product.yes": { fr: "Oui", nl: "Ja", en: "Yes" },
  "product.no": { fr: "Non", nl: "Nee", en: "No" },
  "product.addToCart": { fr: "Ajouter au panier", nl: "Toevoegen aan winkelwagen", en: "Add to cart" },
  "product.addToCartLocation": { fr: "Ajouter au panier (location)", nl: "Toevoegen (verhuur)", en: "Add to cart (rental)" },
  "product.addedToCart": { fr: "ajouté au panier", nl: "toegevoegd aan winkelwagen", en: "added to cart" },
  "product.viewCart": { fr: "Voir le panier", nl: "Bekijk winkelwagen", en: "View cart" },

  // ── Cart ──
  "cart.title": { fr: "Mon panier", nl: "Mijn winkelwagen", en: "My cart" },
  "cart.empty": { fr: "Votre panier est vide", nl: "Uw winkelwagen is leeg", en: "Your cart is empty" },
  "cart.emptyDesc": {
    fr: "Parcourez notre catalogue pour ajouter des gobelets réutilisables à votre panier.",
    nl: "Blader door onze catalogus om herbruikbare bekers aan uw winkelwagen toe te voegen.",
    en: "Browse our catalog to add reusable cups to your cart.",
  },
  "cart.continue": { fr: "Continuer mes achats", nl: "Verder winkelen", en: "Continue shopping" },
  "cart.summary": { fr: "Récapitulatif", nl: "Samenvatting", en: "Summary" },
  "cart.totalHT": { fr: "Total HT", nl: "Totaal excl.", en: "Total excl." },
  "cart.tva": { fr: "TVA (21%)", nl: "BTW (21%)", en: "VAT (21%)" },
  "cart.totalTTC": { fr: "Total TTC", nl: "Totaal incl.", en: "Total incl." },
  "cart.order": { fr: "Passer commande", nl: "Bestelling plaatsen", en: "Place order" },
  "cart.preferQuote": { fr: "Préférer un devis", nl: "Liever een offerte", en: "Prefer a quote" },
  "cart.quoteNeeded": {
    fr: "Votre panier contient des quantités nécessitant un devis personnalisé.",
    nl: "Uw winkelwagen bevat hoeveelheden waarvoor een gepersonaliseerde offerte nodig is.",
    en: "Your cart contains quantities requiring a personalized quote.",
  },
  "cart.clear": { fr: "Vider le panier", nl: "Winkelwagen legen", en: "Clear cart" },
  "cart.quoteItem": { fr: "Quantité soumise à devis personnalisé", nl: "Hoeveelheid onderworpen aan offerte", en: "Quantity subject to personalized quote" },
  "cart.delivery": { fr: "Livraison express 24-48h", nl: "Express levering 24-48u", en: "Express delivery 24-48h" },
  "cart.payment": { fr: "Paiement sécurisé (Bancontact/CB)", nl: "Veilige betaling (Bancontact/CB)", en: "Secure payment (Bancontact/CB)" },
  "cart.articles": { fr: "articles", nl: "artikelen", en: "items" },

  // ── Footer ──
  "footer.tagline": {
    fr: "Gobelets réutilisables et verres incassables premium pour tous vos événements.",
    nl: "Herbruikbare bekers en premium onbreekbare glazen voor al uw evenementen.",
    en: "Reusable cups and premium unbreakable glasses for all your events.",
  },
  "footer.products": { fr: "Produits", nl: "Producten", en: "Products" },
  "footer.company": { fr: "Entreprise", nl: "Bedrijf", en: "Company" },
  "footer.support": { fr: "Support", nl: "Ondersteuning", en: "Support" },
  "footer.rights": { fr: "Tous droits réservés", nl: "Alle rechten voorbehouden", en: "All rights reserved" },
  "footer.legal": { fr: "Mentions légales", nl: "Juridische informatie", en: "Legal notice" },
  "footer.cgv": { fr: "CGV", nl: "AV", en: "T&C" },
  "footer.privacy": { fr: "Confidentialité", nl: "Privacy", en: "Privacy" },

  // ── Common ──
  "common.purchase": { fr: "Achat", nl: "Aankoop", en: "Purchase" },
  "common.rental": { fr: "Location", nl: "Verhuur", en: "Rental" },
  "common.yes": { fr: "Oui", nl: "Ja", en: "Yes" },
  "common.no": { fr: "Non", nl: "Nee", en: "No" },

  // ── Auth ──
  "auth.loginTitle": { fr: "Connexion", nl: "Inloggen", en: "Sign in" },
  "auth.signupTitle": { fr: "Créer un compte", nl: "Account aanmaken", en: "Create account" },
  "auth.forgotTitle": { fr: "Mot de passe oublié", nl: "Wachtwoord vergeten", en: "Forgot password" },
  "auth.loginSubtitle": { fr: "Accédez à votre espace client", nl: "Toegang tot uw klantenzone", en: "Access your account" },
  "auth.signupSubtitle": { fr: "Rejoignez Festicup en quelques secondes", nl: "Word lid van Festicup in enkele seconden", en: "Join Festicup in seconds" },
  "auth.forgotSubtitle": { fr: "Entrez votre email pour réinitialiser votre mot de passe", nl: "Voer uw e-mail in om uw wachtwoord te resetten", en: "Enter your email to reset your password" },
  "auth.fullName": { fr: "Nom complet", nl: "Volledige naam", en: "Full name" },
  "auth.fullNamePlaceholder": { fr: "Jean Dupont", nl: "Jan Janssen", en: "John Doe" },
  "auth.email": { fr: "Email", nl: "E-mail", en: "Email" },
  "auth.password": { fr: "Mot de passe", nl: "Wachtwoord", en: "Password" },
  "auth.forgotLink": { fr: "Mot de passe oublié ?", nl: "Wachtwoord vergeten?", en: "Forgot password?" },
  "auth.loginBtn": { fr: "Se connecter", nl: "Inloggen", en: "Sign in" },
  "auth.signupBtn": { fr: "Créer mon compte", nl: "Account aanmaken", en: "Create account" },
  "auth.resetBtn": { fr: "Envoyer le lien", nl: "Link verzenden", en: "Send reset link" },
  "auth.noAccount": { fr: "Pas encore de compte ?", nl: "Nog geen account?", en: "Don't have an account?" },
  "auth.signupLink": { fr: "Créer un compte", nl: "Account aanmaken", en: "Create account" },
  "auth.hasAccount": { fr: "Déjà un compte ?", nl: "Al een account?", en: "Already have an account?" },
  "auth.loginLink": { fr: "Se connecter", nl: "Inloggen", en: "Sign in" },
  "auth.backToLogin": { fr: "Retour à la connexion", nl: "Terug naar inloggen", en: "Back to sign in" },
  "auth.error": { fr: "Erreur", nl: "Fout", en: "Error" },
  "auth.resetSent": { fr: "Email envoyé", nl: "E-mail verzonden", en: "Email sent" },
  "auth.resetSentDesc": { fr: "Consultez votre boîte mail pour réinitialiser votre mot de passe.", nl: "Controleer uw e-mail om uw wachtwoord te resetten.", en: "Check your email to reset your password." },
  "auth.signupSuccess": { fr: "Compte créé", nl: "Account aangemaakt", en: "Account created" },
  "auth.confirmEmail": { fr: "Vérifiez votre email pour confirmer votre inscription.", nl: "Controleer uw e-mail om uw registratie te bevestigen.", en: "Check your email to confirm your registration." },
  "auth.newPasswordTitle": { fr: "Nouveau mot de passe", nl: "Nieuw wachtwoord", en: "New password" },
  "auth.newPasswordSubtitle": { fr: "Choisissez un nouveau mot de passe sécurisé", nl: "Kies een nieuw veilig wachtwoord", en: "Choose a new secure password" },
  "auth.newPassword": { fr: "Nouveau mot de passe", nl: "Nieuw wachtwoord", en: "New password" },
  "auth.confirmPassword": { fr: "Confirmer le mot de passe", nl: "Wachtwoord bevestigen", en: "Confirm password" },
  "auth.updatePasswordBtn": { fr: "Mettre à jour", nl: "Bijwerken", en: "Update password" },
  "auth.passwordMismatch": { fr: "Les mots de passe ne correspondent pas", nl: "Wachtwoorden komen niet overeen", en: "Passwords don't match" },
  "auth.passwordUpdated": { fr: "Mot de passe mis à jour", nl: "Wachtwoord bijgewerkt", en: "Password updated" },

  // ── Account ──
  "account.title": { fr: "Mon compte", nl: "Mijn account", en: "My account" },
  "account.logout": { fr: "Déconnexion", nl: "Uitloggen", en: "Sign out" },
  "account.profile": { fr: "Profil", nl: "Profiel", en: "Profile" },
  "account.orders": { fr: "Commandes", nl: "Bestellingen", en: "Orders" },
  "account.phone": { fr: "Téléphone", nl: "Telefoon", en: "Phone" },
  "account.company": { fr: "Entreprise", nl: "Bedrijf", en: "Company" },
  "account.defaultAddress": { fr: "Adresse par défaut", nl: "Standaardadres", en: "Default address" },
  "account.save": { fr: "Enregistrer", nl: "Opslaan", en: "Save" },
  "account.saved": { fr: "Profil enregistré", nl: "Profiel opgeslagen", en: "Profile saved" },
  "account.noOrders": { fr: "Aucune commande pour le moment", nl: "Nog geen bestellingen", en: "No orders yet" },
  "account.item": { fr: "article", nl: "artikel", en: "item" },
  "account.items": { fr: "articles", nl: "artikelen", en: "items" },

  // ── Order statuses ──
  "order.status.pending": { fr: "En attente", nl: "In afwachting", en: "Pending" },
  "order.status.paid": { fr: "Payée", nl: "Betaald", en: "Paid" },
  "order.status.cancelled": { fr: "Annulée", nl: "Geannuleerd", en: "Cancelled" },

  // ── Status badges ──
  "status.pending": { fr: "En attente", nl: "In afwachting", en: "Pending" },
  "status.contacted": { fr: "Contacté", nl: "Gecontacteerd", en: "Contacted" },
  "status.offer_sent": { fr: "Offre envoyée", nl: "Offerte verzonden", en: "Offer sent" },
  "status.accepted": { fr: "Accepté", nl: "Geaccepteerd", en: "Accepted" },
  "status.converted": { fr: "Converti", nl: "Geconverteerd", en: "Converted" },
  "status.expired": { fr: "Expiré", nl: "Verlopen", en: "Expired" },
  "status.rejected": { fr: "Rejeté", nl: "Afgewezen", en: "Rejected" },
  "status.paid": { fr: "Payée", nl: "Betaald", en: "Paid" },
  "status.cancelled": { fr: "Annulée", nl: "Geannuleerd", en: "Cancelled" },
  "status.preparing": { fr: "En préparation", nl: "In voorbereiding", en: "Preparing" },
  "status.shipped": { fr: "Expédié", nl: "Verzonden", en: "Shipped" },
  "status.delivered": { fr: "Livré", nl: "Geleverd", en: "Delivered" },

  // ── NotFound ──
  "notFound.title": { fr: "Page introuvable", nl: "Pagina niet gevonden", en: "Page not found" },
  "notFound.subtitle": { fr: "La page que vous recherchez n'existe pas ou a été déplacée.", nl: "De pagina die u zoekt bestaat niet of is verplaatst.", en: "The page you're looking for doesn't exist or has been moved." },
  "notFound.home": { fr: "Retour à l'accueil", nl: "Terug naar home", en: "Back to home" },
  "notFound.catalog": { fr: "Voir notre catalogue", nl: "Bekijk onze catalogus", en: "View our catalog" },

  // ── Compte layout nav ──
  "compte.nav.infos": { fr: "Mes informations", nl: "Mijn gegevens", en: "My information" },
  "compte.nav.commandes": { fr: "Mes commandes", nl: "Mijn bestellingen", en: "My orders" },
  "compte.nav.devis": { fr: "Mes devis", nl: "Mijn offertes", en: "My quotes" },
  "compte.nav.adresses": { fr: "Mes adresses", nl: "Mijn adressen", en: "My addresses" },

  // ── Infos page ──
  "infos.personal": { fr: "Informations personnelles", nl: "Persoonlijke gegevens", en: "Personal information" },
  "infos.security": { fr: "Sécurité", nl: "Beveiliging", en: "Security" },
  "infos.newPassword": { fr: "Nouveau mot de passe", nl: "Nieuw wachtwoord", en: "New password" },
  "infos.changePassword": { fr: "Changer le mot de passe", nl: "Wachtwoord wijzigen", en: "Change password" },
  "infos.deleteAccount": { fr: "Supprimer mon compte", nl: "Mijn account verwijderen", en: "Delete my account" },
  "infos.deleteConfirmText": { fr: "Tapez SUPPRIMER pour confirmer la suppression de votre compte.", nl: "Typ SUPPRIMER om de verwijdering te bevestigen.", en: "Type SUPPRIMER to confirm account deletion." },
  "infos.deleteConfirmPlaceholder": { fr: "Tapez SUPPRIMER", nl: "Typ SUPPRIMER", en: "Type SUPPRIMER" },

  // ── Commandes page ──
  "commandes.discover": { fr: "Découvrir la gamme", nl: "Ontdek het assortiment", en: "Discover the range" },

  // ── Devis page ──
  "devisPage.empty": { fr: "Aucun devis pour le moment", nl: "Nog geen offertes", en: "No quotes yet" },
  "devisPage.request": { fr: "Demander un devis", nl: "Offerte aanvragen", en: "Request a quote" },
  "devisPage.estimatedValue": { fr: "Valeur estimée", nl: "Geschatte waarde", en: "Estimated value" },
  "devisPage.viewAccept": { fr: "Voir et accepter", nl: "Bekijken en accepteren", en: "View and accept" },
  "devisPage.renew": { fr: "Renouveler", nl: "Vernieuwen", en: "Renew" },

  // ── Adresses page ──
  "adresses.default": { fr: "Par défaut", nl: "Standaard", en: "Default" },
  "adresses.setDefault": { fr: "Définir par défaut", nl: "Als standaard instellen", en: "Set as default" },
  "adresses.delete": { fr: "Supprimer", nl: "Verwijderen", en: "Delete" },
  "adresses.add": { fr: "Ajouter une adresse", nl: "Adres toevoegen", en: "Add address" },
  "adresses.cancel": { fr: "Annuler", nl: "Annuleren", en: "Cancel" },
  "adresses.defaultUpdated": { fr: "Adresse par défaut mise à jour", nl: "Standaardadres bijgewerkt", en: "Default address updated" },
  "adresses.added": { fr: "Adresse ajoutée", nl: "Adres toegevoegd", en: "Address added" },

  // ── Devis Acceptation ──
  "devisAccept.title": { fr: "Offre", nl: "Offerte", en: "Quote" },
  "devisAccept.validUntil": { fr: "Valable jusqu'au", nl: "Geldig tot", en: "Valid until" },
  "devisAccept.product": { fr: "Produit", nl: "Product", en: "Product" },
  "devisAccept.qty": { fr: "Qté", nl: "Aantal", en: "Qty" },
  "devisAccept.color": { fr: "Couleur", nl: "Kleur", en: "Color" },
  "devisAccept.impression": { fr: "Impression", nl: "Bedrukking", en: "Print" },
  "devisAccept.unitPrice": { fr: "Prix unit.", nl: "Eenheidsprijs", en: "Unit price" },
  "devisAccept.subtotal": { fr: "Sous-total", nl: "Subtotaal", en: "Subtotal" },
  "devisAccept.downloadPDF": { fr: "Télécharger le PDF", nl: "PDF downloaden", en: "Download PDF" },
  "devisAccept.acceptPay": { fr: "Accepter et payer", nl: "Accepteren en betalen", en: "Accept and pay" },
  "devisAccept.requestChange": { fr: "Demander une modification", nl: "Wijziging aanvragen", en: "Request a change" },
  "devisAccept.expired": { fr: "Cette offre a expiré", nl: "Deze offerte is verlopen", en: "This offer has expired" },
  "devisAccept.expiredDesc": { fr: "L'offre n'est plus disponible. Contactez notre équipe pour en obtenir une nouvelle.", nl: "De offerte is niet meer beschikbaar. Neem contact op met ons team.", en: "The offer is no longer available. Contact our team for a new one." },
  "devisAccept.contact": { fr: "Contacter l'équipe", nl: "Team contacteren", en: "Contact the team" },
};
