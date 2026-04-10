import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export interface Product {
  id: number;
  name: string;
  slug: string;
  reference: string;
  image: string;
  priceFrom: number;
  type: "achat" | "location";
  badge?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      to={`/produits/${product.slug}`}
      className="group block bg-card rounded-lg overflow-hidden border border-transparent hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="aspect-square bg-card p-4 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
            {product.type === "location" ? "Location" : "Achat"}
          </span>
          {product.badge && (
            <span className="text-[10px] uppercase tracking-widest font-semibold text-success bg-success/10 px-2 py-0.5 rounded-sm">
              {product.badge}
            </span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-card-foreground font-sans leading-tight">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground">Réf. {product.reference}</p>
        <p className="text-sm font-semibold text-card-foreground">
          À partir de <span className="text-primary">{product.priceFrom.toFixed(2)} €</span>
        </p>
        <Button className="w-full mt-2 text-xs h-9" size="sm">
          Voir le produit
        </Button>
      </div>
    </Link>
  );
};

export default ProductCard;
