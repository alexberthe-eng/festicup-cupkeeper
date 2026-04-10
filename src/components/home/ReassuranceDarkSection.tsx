const reassuranceItems = [
  {
    icon: "🇫🇷",
    title: "100% made in France",
    desc: "Fabrication et personnalisation de vos gobelets en France",
  },
  {
    icon: "📋",
    title: "Large choix de gamme",
    desc: "Des gobelets adaptés à tous types d'événements",
  },
  {
    icon: "👤",
    title: "Chargé de client dédié",
    desc: "Un interlocuteur unique pour votre projet",
  },
  {
    icon: "📦",
    title: "Commande dès 25 unités",
    desc: "Minimum de commande accessible pour tous",
  },
];

const ReassuranceDarkSection = () => {
  return (
    <section className="bg-festicup-dark py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {reassuranceItems.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center gap-3">
              <span className="text-3xl">{item.icon}</span>
              <h4 className="text-white font-sans font-semibold text-sm">{item.title}</h4>
              <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReassuranceDarkSection;
