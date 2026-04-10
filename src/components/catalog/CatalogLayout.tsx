import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CatalogFilters from "@/components/catalog/CatalogFilters";
import ProductCard from "@/components/catalog/ProductCard";
import { useCatalogProducts } from "@/hooks/use-prestashop-products";

interface CatalogLayoutProps {
  mode: "achat" | "location";
}

const CatalogLayout = ({ mode }: CatalogLayoutProps) => {
  const [searchParams] = useSearchParams();
  const gammeFromUrl = searchParams.get("gamme") as "ecocup" | "prestige" | null;

  const [selectedGamme, setSelectedGamme] = useState<"all" | "ecocup" | "prestige">(
    gammeFromUrl || "all"
  );
  const [selectedCapacity, setSelectedCapacity] = useState<string | null>(null);

  const { products, isLoading, isLive } = useCatalogProducts();

  // Filter products by mode
  const modeProducts = useMemo(
    () => products.filter((p) => p.mode === "both" || p.mode === mode),
    [products, mode]
  );

  // Get available capacities
  const capacities = useMemo(() => {
    const caps = new Set(modeProducts.map((p) => p.capacity).filter(Boolean));
    return Array.from(caps).sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      return numA - numB;
    });
  }, [modeProducts]);

  // Apply filters
  const filtered = useMemo(() => {
    return modeProducts.filter((p) => {
      if (selectedGamme !== "all" && p.gamme !== selectedGamme) return false;
      if (selectedCapacity && p.capacity !== selectedCapacity) return false;
      return true;
    });
  }, [modeProducts, selectedGamme, selectedCapacity]);

  const isLocation = mode === "location";

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="bg-background min-h-screen">
        {/* Hero banner */}
        <section className="bg-festicup-dark py-10 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.2em] text-festicup-gold font-semibold mb-2 block">
                {isLocation ? "Location" : "Achat"}
              </span>
              <h1 className="text-3xl lg:text-5xl font-serif font-bold text-white mb-3">
                {isLocation
                  ? "Louez vos gobelets réutilisables"
                  : "Achetez vos gobelets réutilisables"}
              </h1>
              <p className="text-sm text-white/60 max-w-lg leading-relaxed">
                {isLocation
                  ? "Location de gobelets personnalisés pour vos événements. Caution préautorisée, jamais débitée. Retour simple et gratuit."
                  : "Gobelets réutilisables personnalisés pour tous vos événements. Prix dégressifs, commande dès 25 unités. 100% made in France."}
              </p>
              {isLive && (
                <span className="inline-flex items-center gap-1.5 mt-3 text-[10px] text-green-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Données en direct depuis PrestaShop
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Filters + Grid */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <CatalogFilters
              selectedGamme={selectedGamme}
              onGammeChange={setSelectedGamme}
              selectedCapacity={selectedCapacity}
              onCapacityChange={setSelectedCapacity}
              capacities={capacities}
              resultCount={filtered.length}
            />

            {/* Loading state */}
            {isLoading && (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5 mt-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-square bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-muted rounded w-1/3" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                      <div className="h-3 bg-muted rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Product grid */}
            {!isLoading && (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5 mt-6">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    catalogMode={mode}
                  />
                ))}
              </div>
            )}

            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-sm">
                  Aucun produit ne correspond à vos critères.
                </p>
                <button
                  onClick={() => {
                    setSelectedGamme("all");
                    setSelectedCapacity(null);
                  }}
                  className="mt-3 text-festicup-gold text-sm font-medium hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Bottom reassurance */}
        <section className="bg-festicup-bg-light py-8 lg:py-10 border-t border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: "🇫🇷", title: "Made in France", desc: "Fabrication française" },
                { icon: "📦", title: "Dès 25 unités", desc: "Commande minimum accessible" },
                { icon: "🚚", title: "Livraison express", desc: "En 24h partout en Belgique" },
                {
                  icon: isLocation ? "🔒" : "📉",
                  title: isLocation ? "Caution sécurisée" : "Prix dégressifs",
                  desc: isLocation
                    ? "Jamais débitée, libérée au retour"
                    : "Plus vous commandez, moins c'est cher",
                },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center text-center gap-1.5">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs font-semibold">{item.title}</span>
                  <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CatalogLayout;
