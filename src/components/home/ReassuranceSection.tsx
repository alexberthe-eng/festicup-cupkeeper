import { Truck, HeadphonesIcon, Package, Leaf } from "lucide-react";

const items = [
  {
    icon: Truck,
    title: "Livraison express en 24h",
    description: "Recevez vos gobelets en un temps record, partout en Europe.",
  },
  {
    icon: HeadphonesIcon,
    title: "Conseils d'experts dédiés",
    description: "Notre équipe vous accompagne de A à Z dans votre projet.",
  },
  {
    icon: Package,
    title: "Livraison gratuite dès 3 packs",
    description: "Profitez de la livraison offerte à partir de 3 packs commandés.",
  },
  {
    icon: Leaf,
    title: "100% éco-responsable",
    description: "Des produits durables, réutilisables et fabriqués en France.",
  },
];

const ReassuranceSection = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.title} className="text-center space-y-3">
              <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-foreground font-sans">{item.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReassuranceSection;
