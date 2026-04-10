const stats = [
  { value: "+10", label: "années d'expérience" },
  { value: "+20", label: "professionnels à vos côtés" },
  { value: "+500k", label: "gobelets nettoyés par jour" },
  { value: "+5Mill", label: "gobelets disponibles" },
];

const ChiffresSection = () => {
  return (
    <section className="bg-festicup-dark py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Stats grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-6 lg:gap-8">
              {stats.map((stat) => (
                <div key={stat.value} className="bg-white/5 rounded-2xl p-6 lg:p-8">
                  <p className="text-festicup-gold text-3xl lg:text-4xl font-serif font-bold mb-2">
                    {stat.value}
                  </p>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="flex-1">
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
                alt="Verres de champagne"
                className="w-full h-[300px] lg:h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChiffresSection;
