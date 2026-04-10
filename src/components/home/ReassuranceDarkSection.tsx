import { Factory, LayoutGrid, UserCheck, Package } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const ReassuranceDarkSection = () => {
  const { t } = useI18n();

  const reassuranceItems = [
    { icon: Factory, title: t("reassurance.france"), desc: t("reassurance.france.desc") },
    { icon: LayoutGrid, title: t("reassurance.choice"), desc: t("reassurance.choice.desc") },
    { icon: UserCheck, title: t("reassurance.dedicated"), desc: t("reassurance.dedicated.desc") },
    { icon: Package, title: t("reassurance.min"), desc: t("reassurance.min.desc") },
  ];

  return (
    <section className="bg-festicup-dark py-10 lg:py-14">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {reassuranceItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex flex-col items-center text-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-festicup-gold" />
                </div>
                <h4 className="text-white font-sans font-semibold text-xs">{item.title}</h4>
                <p className="text-white/40 text-[11px] leading-relaxed max-w-[180px]">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ReassuranceDarkSection;
