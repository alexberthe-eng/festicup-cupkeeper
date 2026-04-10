import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, FileText, AlertTriangle, Check, Truck, RotateCcw, Shield, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/contexts/I18nContext";
import { toast } from "sonner";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  formatPrice,
  getPriceTTC,
  getPriceForQty,
  isAboveQuoteThreshold,
  isNearQuoteThreshold,
  QUOTE_THRESHOLD,
  type Product,
} from "@/data/products";
import { useProductBySlug, type PrestashopProduct, type PrestashopCombination } from "@/hooks/use-prestashop-products";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, rawProduct, isLoading } = useProductBySlug(slug || "");
  const { t } = useI18n();

  if (isLoading) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-festicup-gold" />
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <p className="text-lg font-medium">{t("product.notFound")}</p>
          <Link to="/achat" className="text-festicup-gold hover:underline text-sm">
            ← {t("product.backToCatalog")}
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
        <ProductConfigurator product={product} rawProduct={rawProduct} />
      </main>
      <Footer />
    </>
  );
};

// ─── Configurator ────────────────────────────────────────────

interface ConfiguratorProps {
  product: Product;
  rawProduct: PrestashopProduct | null;
}

const ProductConfigurator = ({ product, rawProduct }: ConfiguratorProps) => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const combinations = rawProduct?.combinations || [];
  const hasCombinations = combinations.length > 0;

  // Extract attribute groups from combinations
  const attributeGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (const combo of combinations) {
      for (const attr of combo.attributes) {
        if (!groups[attr.group]) groups[attr.group] = [];
        if (!groups[attr.group].includes(attr.name)) {
          groups[attr.group].push(attr.name);
        }
      }
    }
    return groups;
  }, [combinations]);

  // State for selected attributes
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const [group, values] of Object.entries(attributeGroups)) {
      initial[group] = values[0] || "";
    }
    return initial;
  });

  // Find active combination based on selected attributes
  const activeCombination = useMemo(() => {
    if (!hasCombinations) return null;
    return combinations.find((combo) =>
      combo.attributes.every(
        (attr) => selectedAttributes[attr.group] === attr.name
      )
    ) || null;
  }, [combinations, selectedAttributes, hasCombinations]);

  // Price from active combination or base product
  const basePrice = useMemo(() => {
    if (activeCombination && rawProduct) {
      return rawProduct.priceHT + activeCombination.price;
    }
    return rawProduct?.priceHT || product.priceTiers[0]?.priceHT || 0;
  }, [activeCombination, rawProduct, product]);

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

  const unitPrice = mode === "achat" ? basePrice : (product.locationPriceHT || 0);
  const totalHT = unitPrice * quantity;
  const totalTTC = getPriceTTC(totalHT);

  const adjustQty = (delta: number) => {
    setQuantity(Math.max(product.minQty, quantity + delta));
  };

  const handleQtyInput = (value: string) => {
    const num = parseInt(value) || product.minQty;
    setQuantity(Math.max(product.minQty, num));
  };

  // Check if a group is a color group
  const isColorGroup = (group: string) => {
    const g = group.toLowerCase();
    return g.includes("couleur") || g.includes("color") || g.includes("kleur");
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">{t("nav.home")}</Link>
        <span>/</span>
        <Link to={mode === "location" ? "/location" : "/achat"} className="hover:text-foreground">
          {mode === "location" ? t("nav.location") : t("nav.achat")}
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

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { icon: Truck, label: t("product.delivery") },
              { icon: RotateCcw, label: t("product.freeReturn") },
              { icon: Shield, label: t("product.securePay") },
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
          <p className="text-sm text-muted-foreground mb-6 max-w-md leading-relaxed">
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
                  {t("nav.achat")}
                </button>
                <button
                  onClick={() => setMode("location")}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    mode === "location"
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("nav.location")}
                </button>
              </div>
            </div>
          )}

          {/* ─── Combination selectors (size, color, etc.) ─── */}
          {hasCombinations && Object.entries(attributeGroups).map(([group, values]) => (
            <div key={group} className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2">
                {group}
              </p>
              {isColorGroup(group) ? (
                <div className="flex gap-2 flex-wrap">
                  {values.map((value) => (
                    <button
                      key={value}
                      onClick={() => setSelectedAttributes((prev) => ({ ...prev, [group]: value }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedAttributes[group] === value
                          ? "border-festicup-gold bg-festicup-gold/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      }`}
                      title={value}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {values.map((value) => (
                    <button
                      key={value}
                      onClick={() => setSelectedAttributes((prev) => ({ ...prev, [group]: value }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        selectedAttributes[group] === value
                          ? "border-festicup-gold bg-festicup-gold/10 text-foreground shadow-sm"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* ─── Fallback color selector (non-combination products) ─── */}
          {!hasCombinations && product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2">
                {t("product.color")}
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
                    aria-label={`${t("product.color")} ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ─── Customization ─── */}
          {product.customizable && (
            <div className="mb-6 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                {t("product.customization")}
              </p>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{t("product.customText")}</label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={t("product.customPlaceholder")}
                  className="w-full h-9 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-festicup-gold/50"
                  maxLength={30}
                />
                <p className="text-[10px] text-muted-foreground mt-1">{customText.length}/30</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customLogo}
                  onChange={(e) => setCustomLogo(e.target.checked)}
                  className="w-4 h-4 rounded border-border accent-festicup-gold"
                />
                <span className="text-xs">{t("product.addLogo")}</span>
                <span className="text-[10px] text-muted-foreground">({t("product.logoHint")})</span>
              </label>
            </div>
          )}

          {/* ─── Quantity ─── */}
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2">
              {t("product.quantity")} <span className="normal-case">(min. {product.minQty})</span>
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjustQty(-25)}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="−"
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
                aria-label="+"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ─── Combination price comparison ─── */}
          {hasCombinations && mode === "achat" && (
            <div className="mb-5 bg-secondary/40 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2.5">
                {t("product.priceByVariant")}
              </p>
              <div className="space-y-1.5">
                {combinations.map((combo) => {
                  const comboPrice = (rawProduct?.priceHT || 0) + combo.price;
                  const label = combo.attributes.map((a) => a.name).join(" · ");
                  const isActive = activeCombination?.id === combo.id;
                  return (
                    <button
                      key={combo.id}
                      onClick={() => {
                        const newAttrs: Record<string, string> = {};
                        combo.attributes.forEach((a) => { newAttrs[a.group] = a.name; });
                        setSelectedAttributes(newAttrs);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                        isActive
                          ? "bg-festicup-gold/15 border border-festicup-gold/30"
                          : "bg-background/60 hover:bg-background"
                      }`}
                    >
                      <span className={isActive ? "font-semibold" : "text-muted-foreground"}>
                        {label}
                        {combo.reference && <span className="text-muted-foreground ml-2">({combo.reference})</span>}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isActive ? "text-festicup-gold" : ""}`}>
                          {formatPrice(comboPrice)} HT
                        </span>
                        {isActive && <Check className="w-3.5 h-3.5 text-festicup-gold" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Price tiers table (non-combination products, achat only) ─── */}
          {!hasCombinations && mode === "achat" && product.priceTiers.length > 1 && (
            <div className="mb-5 bg-secondary/40 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2.5">
                📉 {t("product.priceTiers")}
              </p>
              <div className="space-y-1.5">
                {product.priceTiers.map((tier, i) => {
                  const isActive = quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty);
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
                          ? `${tier.minQty} – ${tier.maxQty} ${t("product.units")}`
                          : `${tier.minQty}+ ${t("product.units")}`}
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
                <p className="text-xs font-semibold">{t("product.nearQuoteTitle")}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t("product.nearQuoteDesc")} {QUOTE_THRESHOLD} {t("product.units")}.
                </p>
              </div>
            </div>
          )}

          {/* ─── Quote mode alert ─── */}
          {isQuote && (
            <div className="mb-4 bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-festicup-gold shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold">{t("product.quoteMode")}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t("product.quoteModeDesc")}
                </p>
              </div>
            </div>
          )}

          {/* ─── Total + CTA ─── */}
          <div className="border-t border-border pt-5">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {mode === "location" ? t("product.totalLocation") : t("product.totalEstimated")}
                </p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-bold text-festicup-gold">
                    {formatPrice(totalHT)}
                  </span>
                  <span className="text-xs text-muted-foreground">HT</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {t("product.ie")} {formatPrice(totalTTC)} TTC · {formatPrice(unitPrice)}/{t("product.piece")}{mode === "location" ? `/${t("product.day")}` : ""}
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
                {t("product.requestQuote")}
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
                {t("product.securePayment")}
              </p>
            )}
          </div>

          {/* ─── Features ─── */}
          <div className="mt-6 border-t border-border pt-5 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">
              {t("product.specs")}
            </p>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {[
                { label: t("product.specCapacity"), value: product.capacity || "—" },
                { label: t("product.specGamme"), value: product.gamme === "ecocup" ? "Ecocup" : "Prestige" },
                { label: t("product.specMaterial"), value: product.gamme === "ecocup" ? "Polypropylène" : "Tritan™" },
                { label: t("product.specCustom"), value: product.customizable ? t("product.yes") : t("product.no") },
                { label: t("product.specWashes"), value: product.gamme === "ecocup" ? "150+" : "300+" },
                { label: t("product.specOrigin"), value: "France 🇫🇷" },
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
  const { t } = useI18n();

  const handleAdd = () => {
    addItem({ product, qty, mode, color, customText, withLogo });
    toast.success(`${product.name} ${t("product.addedToCart")}`, {
      action: { label: t("product.viewCart"), onClick: () => navigate("/panier") },
    });
  };

  return (
    <Button
      onClick={handleAdd}
      className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-lg h-12 text-sm font-semibold gap-2"
    >
      <ShoppingBag className="w-4 h-4" />
      {mode === "location" ? t("product.addToCartLocation") : t("product.addToCart")}
    </Button>
  );
};

export default ProductDetail;
