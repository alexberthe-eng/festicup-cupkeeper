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
  "detail.addToCart": { fr: "Ajouter au panier", nl: "Toevoegen aan winkelwagen", en: "Add to cart" },
  "detail.addToCartRental": { fr: "Ajouter au panier (location)", nl: "Toevoegen (verhuur)", en: "Add to cart (rental)" },
  "detail.requestQuote": { fr: "Demander un devis personnalisé", nl: "Gepersonaliseerde offerte aanvragen", en: "Request a personalized quote" },
  "detail.quoteMode": { fr: "Mode devis activé", nl: "Offertemodus geactiveerd", en: "Quote mode activated" },
  "detail.nearQuote": { fr: "Vous approchez du seuil devis", nl: "U nadert de offertegrens", en: "You're approaching the quote threshold" },
  "detail.quantity": { fr: "Quantité", nl: "Aantal", en: "Quantity" },
  "detail.color": { fr: "Couleur", nl: "Kleur", en: "Color" },
  "detail.customText": { fr: "Texte personnalisé", nl: "Gepersonaliseerde tekst", en: "Custom text" },
  "detail.logo": { fr: "Ajouter un logo", nl: "Logo toevoegen", en: "Add a logo" },
  "detail.features": { fr: "Caractéristiques", nl: "Kenmerken", en: "Features" },
  "detail.capacity": { fr: "Contenance", nl: "Inhoud", en: "Capacity" },
  "detail.range": { fr: "Gamme", nl: "Assortiment", en: "Range" },
  "detail.material": { fr: "Matière", nl: "Materiaal", en: "Material" },
  "detail.washes": { fr: "Lavages", nl: "Wasbeurten", en: "Washes" },
  "detail.manufacturing": { fr: "Fabrication", nl: "Fabricage", en: "Manufacturing" },
  "detail.addedToCart": { fr: "ajouté au panier", nl: "toegevoegd aan winkelwagen", en: "added to cart" },
  "detail.viewCart": { fr: "Voir le panier", nl: "Bekijk winkelwagen", en: "View cart" },

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
};
