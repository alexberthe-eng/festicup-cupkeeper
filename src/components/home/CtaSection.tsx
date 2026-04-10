import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-background/85" />
      <div className="relative z-10 container px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
          Prêt à rendre votre événement plus éco-responsable ?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Rejoignez les milliers d'organisateurs qui nous font confiance
        </p>
        <Button asChild size="lg" className="text-base px-8 py-6 rounded-lg font-semibold">
          <Link to="/devis">Obtenir un devis</Link>
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
