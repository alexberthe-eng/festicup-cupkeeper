const stats = [
  { value: "+10", label: "années d'expérience" },
  { value: "+500k", label: "gobelets nettoyés par jour" },
  { value: "+20", label: "professionnels à vos côtés" },
  { value: "+5Mill", label: "gobelets disponibles" },
];

const ChiffresSection = () => {
  return (
    <section className="bg-festicup-dark py-12 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          {/* Stats grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 gap-4 lg:gap-5">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/5 rounded-xl p-5 lg:p-6">
                  <p className="text-festicup-gold text-2xl lg:text-3xl font-serif font-bold mb-1">
                    {stat.value}
                  </p>
                  <p className="text-white/50 text-[11px] lg:text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image with overlay */}
          <div className="flex-1 w-full relative">
            <div className="rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
                alt="Verres de champagne premium"
                className="w-full h-[260px] lg:h-[340px] object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute bottom-4 left-4 bg-festicup-dark/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
              <p className="text-festicup-gold text-xs font-semibold">Commande</p>
              <p className="text-festicup-gold text-lg font-serif font-bold">dès 25 unités</p>
              <p className="text-white/50 text-[10px] mt-0.5">
                Gobelets réutilisables personnalisés<br />à votre image et vos couleurs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChiffresSection;
