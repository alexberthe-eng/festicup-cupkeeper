const stats = [
  { value: "+10", label: "Références commandées" },
  { value: "+20", label: "Pays livrés" },
  { value: "+500K", label: "Gobelets disponibles" },
  { value: "+5M", label: "Utilisateurs finaux" },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
