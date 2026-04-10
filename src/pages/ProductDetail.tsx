import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, FileText, AlertTriangle, ChevronLeft, Check, Truck, RotateCcw, Shield } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  findProductBySlug,
  formatPrice,
  getPriceTTC,
  getPriceForQty,
  isAboveQuoteThreshold,
  isNearQuoteThreshold,
  QUOTE_THRESHOLD,
  type Product,
} from "@/data/products";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = findProductBySlug(slug || "");

  if (!product) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <p className="text-lg font-medium">Produit introuvable</p>
          <Link to="/achat" className="text-festicup-gold hover:underline text-sm">
            ← Retour au catalogue
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="bg-background">
        <ProductConfigurator product={product} />
      </main>
      <Footer />
    </>
  );
};

// ─── Configurator ────────────────────────────────────────────

interface ConfiguratorProps {
  product: Product;
}

const ProductConfigurator = ({ product }: ConfiguratorProps) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"achat" | "location">(
    product.mode === "location" ? "location" : "achat"
  );
  const [quantity, setQuantity] = useState(product.minQty);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || null);
  const [customText, setCustomText] = useState("");
  const [customLogo, setCustomLogo] = useState(false);

  const canLocation = product.mode === "both" || product.mode === "location";
  const canAchat = product.mode === "both" || product.mode === "achat";

  const isQuote = mode === "achat" && isAboveQuoteThreshold(quantity);
  const isNearQuote = mode === "achat" && isNearQuoteThreshold(quantity);

  const unitPrice = mode === "achat" ? getPriceForQty(product, quantity) : product.locationPriceHT || 0;
  const totalHT = unitPrice * quantity;
  const totalTTC = getPriceTTC(totalHT);

  const adjustQty = (delta: number) => {
    setQuantity(Math.max(product.minQty, quantity + delta));
  };

  const handleQtyInput = (value: string) => {
    const num = parseInt(value) || product.minQty;
    setQuantity(Math.max(product.minQty, num));
  };

  // Active price tier index
  const activeTierIndex = useMemo(() => {
    for (let i = product.priceTiers.length - 1; i >= 0; i--) {
      if (quantity >= product.priceTiers[i].minQty) return i;
    }
    return 0;
  }, [quantity, product.priceTiers]);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Accueil</Link>
        <span>/</span>
        <Link to={mode === "location" ? "/location" : "/achat"} className="hover:text-foreground">
          {mode === "location" ? "Location" : "Achat"}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* ─── LEFT: Image ─── */}
        <div>
          <div className="relative rounded-2xl overflow-hidden bg-secondary aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-festicup-gold text-foreground text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          {/* Trust signals under image */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { icon: Truck, label: "Livraison 24h" },
              { icon: RotateCcw, label: "Retour gratuit" },
              { icon: Shield, label: "Paiement sécurisé" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2.5">
                <Icon className="w-4 h-4 text-festicup-gold shrink-0" />
                <span className="text-[10px] font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT: Configurator ─── */}
        <div>
          {/* Gamme tag */}
          <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            {product.gamme === "ecocup" ? "Gamme Ecocup" : "Gamme Prestige"} · {product.capacity}
          </span>

          <h1 className="text-2xl lg:text-3xl font-serif font-bold mt-1 mb-2">
            {product.name}
          </h1>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            {product.shortDesc}
          </p>

          {/* ─── Mode toggle ─── */}
          {canAchat && canLocation && (
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2">
                Mode
              </p>
              <div className="inline-flex bg-secondary rounded-full p-1">
                <button
                  onClick={() => setMode("achat")}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    mode === "achat"
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Achat
                </button>
                <button
                  onClick={() => setMode("location")}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    mode === "location"
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Location
                </button>
              </div>
            </div>
          )}

          {/* ─── Color selector ─── */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2">
                Couleur
              </p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-festicup-gold scale-110"
                        : "border-border hover:border-muted-foreground"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Couleur ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ─── Customization ─── */}
          {product.customizable && (
            <div className="mb-6 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                Personnalisation
              </p>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Texte personnalisé (optionnel)</label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Nom de votre événement..."
                  className="w-full h-9 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-festicup-gold/50"
                  maxLength={30}
                />
                <p className="text-[10px] text-muted-foreground mt-1">{customText.length}/30 caractères</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customLogo}
                  onChange={(e) => setCustomLogo(e.target.checked)}
                  className="w-4 h-4 rounded border-border accent-festicup-gold"
                />
                <span className="text-xs">Ajouter mon logo</span>
                <span className="text-[10px] text-muted-foreground">(fichier à fournir après commande)</span>
              </label>
            </div>
          )}

          {/* ─── Quantity ─── */}
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2">
              Quantité <span className="normal-case">(min. {product.minQty})</span>
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjustQty(-25)}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Diminuer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQtyInput(e.target.value)}
                className="w-24 text-center text-xl font-bold bg-transparent border-none outline-none font-sans"
                min={product.minQty}
              />
              <button
                onClick={() => adjustQty(25)}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Augmenter"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ─── Price tiers table (achat only) ─── */}
          {mode === "achat" && (
            <div className="mb-5 bg-secondary/40 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2.5">
                📉 Grille tarifaire — Prix dégressif
              </p>
              <div className="space-y-1.5">
                {product.priceTiers.map((tier, i) => {
                  const isActive = i === activeTierIndex;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                        isActive
                          ? "bg-festicup-gold/15 border border-festicup-gold/30"
                          : "bg-background/60"
                      }`}
                    >
                      <span className={isActive ? "font-semibold" : "text-muted-foreground"}>
                        {tier.maxQty
                          ? `${tier.minQty} – ${tier.maxQty} unités`
                          : `${tier.minQty}+ unités`}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isActive ? "text-festicup-gold" : ""}`}>
                          {formatPrice(tier.priceHT)} HT
                        </span>
                        {isActive && <Check className="w-3.5 h-3.5 text-festicup-gold" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Near-quote warning ─── */}
          {isNearQuote && (
            <div className="mb-4 bg-festicup-warning/10 border border-festicup-warning/30 rounded-lg px-4 py-3 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-festicup-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold">Vous approchez du seuil devis</p>
                <p className="text-[11px] text-muted-foreground">
                  À partir de {QUOTE_THRESHOLD} unités, votre commande basculera en demande de devis
                  pour un accompagnement personnalisé.
                </p>
              </div>
            </div>
          )}

          {/* ─── Quote mode alert ─── */}
          {isQuote && (
            <div className="mb-4 bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-festicup-gold shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold">Mode devis activé</p>
                <p className="text-[11px] text-muted-foreground">
                  Pour {quantity} unités, un chargé de clientèle dédié vous accompagnera.
                  Vous recevrez une offre personnalisée sous 24h.
                </p>
              </div>
            </div>
          )}

          {/* ─── Total + CTA ─── */}
          <div className="border-t border-border pt-5">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {mode === "location" ? "Total location" : "Total estimé"}
                </p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-bold text-festicup-gold">
                    {formatPrice(totalHT)}
                  </span>
                  <span className="text-xs text-muted-foreground">HT</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  soit {formatPrice(totalTTC)} TTC · {formatPrice(unitPrice)}/pièce{mode === "location" ? "/jour" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">{quantity} × {formatPrice(unitPrice)}</p>
              </div>
            </div>

            {isQuote ? (
              <Button
                onClick={() => navigate(`/devis?product=${product.slug}&qty=${quantity}`)}
                className="w-full bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-lg h-12 text-sm font-semibold gap-2"
              >
                <FileText className="w-4 h-4" />
                Demander un devis personnalisé
              </Button>
            ) : (
              <AddToCartButton
                product={product}
                qty={quantity}
                mode={mode}
                color={selectedColor || ""}
                customText={customText}
                withLogo={customLogo}
              />
            )}

            {!isQuote && (
              <p className="text-center text-[10px] text-muted-foreground mt-2">
                Paiement sécurisé · 3x/4x sans frais avec Alma
              </p>
            )}
          </div>

          {/* ─── Features ─── */}
          <div className="mt-6 border-t border-border pt-5 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">
              Caractéristiques
            </p>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {[
                { label: "Contenance", value: product.capacity },
                { label: "Gamme", value: product.gamme === "ecocup" ? "Ecocup" : "Prestige" },
                { label: "Matière", value: product.gamme === "ecocup" ? "Polypropylène" : "Tritan™" },
                { label: "Personnalisable", value: product.customizable ? "Oui" : "Non" },
                { label: "Lavages", value: product.gamme === "ecocup" ? "150+" : "300+" },
                { label: "Fabrication", value: "France 🇫🇷" },
              ].map((feat) => (
                <div key={feat.label} className="flex justify-between bg-secondary/40 rounded-lg px-3 py-2">
                  <span className="text-muted-foreground">{feat.label}</span>
                  <span className="font-medium">{feat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Add to Cart Button ──────────────────────────────────────
const AddToCartButton = ({ product, qty, mode, color, customText, withLogo }: {
  product: Product; qty: number; mode: "achat" | "location"; color: string; customText: string; withLogo: boolean;
}) => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAdd = () => {
    addItem({ product, qty, mode, color, customText, withLogo });
    toast.success(`${product.name} ajouté au panier`, {
      action: { label: "Voir le panier", onClick: () => navigate("/panier") },
    });
  };

  return (
    <Button
      onClick={handleAdd}
      className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-lg h-12 text-sm font-semibold gap-2"
    >
      <ShoppingBag className="w-4 h-4" />
      {mode === "location" ? "Ajouter au panier (location)" : "Ajouter au panier"}
    </Button>
  );
};

export default ProductDetail;
