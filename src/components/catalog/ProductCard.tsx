import { Link } from "react-router-dom";
import { type Product, getBestPrice, getBasePrice, formatPrice, getPriceTTC } from "@/data/products";

interface ProductCardProps {
  product: Product;
  catalogMode: "achat" | "location";
}

const ProductCard = ({ product, catalogMode }: ProductCardProps) => {
  const isLocation = catalogMode === "location";
  const showLocationPrice = isLocation && product.locationPriceHT;

  const bestPrice = getBestPrice(product);
  const basePrice = getBasePrice(product);

  return (
    <Link
      to={`/produits/${product.slug}`}
      className="group bg-background rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-festicup-gold text-foreground text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        {product.customizable && (
          <span className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm text-foreground text-[10px] font-medium px-2 py-0.5 rounded-full border border-border">
            Personnalisable
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Gamme tag */}
        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-sans">
          {product.gamme === "ecocup" ? "Gamme Ecocup" : "Gamme Prestige"}
        </span>

        <h3 className="text-sm font-semibold mt-1 mb-0.5 group-hover:text-festicup-gold transition-colors">
          {product.name}
        </h3>

        <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
          {product.shortDesc}
        </p>

        {/* Capacity + colors */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">
            {product.capacity}
          </span>
          <div className="flex gap-1">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="w-3.5 h-3.5 rounded-full border border-border"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="border-t border-border pt-3">
          {showLocationPrice ? (
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-festicup-gold">
                  {formatPrice(product.locationPriceHT!)}
                </span>
                <span className="text-[10px] text-muted-foreground">HT / pièce / jour</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                soit {formatPrice(getPriceTTC(product.locationPriceHT!))} TTC
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-festicup-gold">
                  dès {formatPrice(bestPrice)}
                </span>
                <span className="text-[10px] text-muted-foreground">HT / pièce</span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-[11px] text-muted-foreground line-through">
                  {formatPrice(basePrice)}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  soit {formatPrice(getPriceTTC(bestPrice))} TTC
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Degressive price hint */}
        {!showLocationPrice && product.priceTiers.length > 1 && (
          <div className="mt-2.5 bg-festicup-gold/10 rounded-lg px-3 py-2">
            <p className="text-[10px] font-medium text-festicup-gold-dark">📉 Prix dégressif</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
              {product.priceTiers.map((tier, i) => (
                <span key={i} className="text-[9px] text-muted-foreground">
                  {tier.maxQty
                    ? `${tier.minQty}–${tier.maxQty}`
                    : `${tier.minQty}+`}
                  : <span className="font-medium text-foreground">{formatPrice(tier.priceHT)}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Min qty */}
        <p className="text-[9px] text-muted-foreground mt-2">
          Minimum : {product.minQty} unités
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
