import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { mockProducts, mockPriceGrid } from "@/data/mock";

const BestSellerSection = () => {
  const bestSeller = mockProducts.find((p) => p.badge === "Best-seller") || mockProducts[0];

  return (
    <section className="py-20 bg-secondary">
      <div className="container px-4">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center text-foreground mb-12">
          Notre Best Seller
        </h2>
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-4xl mx-auto">
          {/* Image */}
          <div className="bg-card rounded-xl p-8 flex items-center justify-center aspect-square">
            <img
              src={bestSeller.image}
              alt={bestSeller.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <span className="inline-block text-xs uppercase tracking-widest font-semibold text-primary bg-primary/10 px-3 py-1 rounded-sm">
              Best-seller
            </span>
            <h3 className="text-2xl font-serif font-bold text-foreground">{bestSeller.name}</h3>
            <p className="text-sm text-muted-foreground">Réf. {bestSeller.reference}</p>

            {/* Price Grid */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 bg-primary/10 text-xs uppercase tracking-widest font-semibold text-primary px-4 py-2">
                <span>Quantité</span>
                <span className="text-right">Prix unitaire HT</span>
              </div>
              {mockPriceGrid.map((row, i) => (
                <div
                  key={row.range}
                  className={`grid grid-cols-2 px-4 py-2.5 text-sm ${
                    i % 2 === 0 ? "bg-background" : "bg-secondary"
                  }`}
                >
                  <span className="text-muted-foreground">{row.range}</span>
                  <span className="text-right font-semibold text-foreground">
                    {typeof row.unitPrice === "number"
                      ? `${row.unitPrice.toFixed(2)} €`
                      : row.unitPrice}
                  </span>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="w-full">
              <Link to={`/produits/${bestSeller.slug}`}>Commander ce produit</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellerSection;
