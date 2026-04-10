import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { mockProducts } from "@/data/mock";

const CatalogPreview = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center text-foreground mb-4">
          Une large gamme pour tous vos événements
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Gobelets, coupes, shots — trouvez le contenant idéal pour chaque occasion.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/10">
            <Link to="/produits">Voir tous nos produits</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CatalogPreview;
