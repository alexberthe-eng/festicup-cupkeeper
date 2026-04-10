import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";

const GammesSection = () => {
  const { t } = useI18n();

  return (
    <section className="bg-festicup-bg-light py-10 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {/* Card Ecocup */}
          <div className="relative rounded-2xl overflow-hidden bg-festicup-dark min-h-[340px] lg:min-h-[420px] flex flex-col justify-end p-6 lg:p-8 group">
            <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80" alt="Ambiance festival avec gobelets" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity" />
            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-1.5 block font-sans">{t("gammes.ecocup.tag")}</span>
              <p className="text-white/70 text-xs mb-1.5 font-sans">{t("gammes.ecocup.desc")}</p>
              <h3 className="text-white text-xl lg:text-2xl font-serif font-bold mb-1">{t("gammes.ecocup.title")}</h3>
              <p className="text-white/60 text-xs mb-5 font-sans">{t("gammes.ecocup.info")}</p>
              <Link to="/achat?gamme=ecocup">
                <Button className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-lg px-5 h-9 text-xs font-medium">{t("gammes.cta.ecocup")}</Button>
              </Link>
            </div>
          </div>

          {/* Card Prestige */}
          <div className="relative rounded-2xl overflow-hidden min-h-[340px] lg:min-h-[420px] flex flex-col justify-end p-6 lg:p-8 group" style={{ backgroundColor: "hsl(var(--festicup-gold))" }}>
            <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80" alt="Verres premium prestige" className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 transition-opacity" />
            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 mb-1.5 block font-sans">{t("gammes.prestige.tag")}</span>
              <p className="text-white/80 text-xs mb-1.5 font-sans">{t("gammes.prestige.desc")}</p>
              <h3 className="text-white text-xl lg:text-2xl font-serif font-bold mb-1">{t("gammes.prestige.title")}</h3>
              <p className="text-white/70 text-xs mb-5 font-sans">{t("gammes.prestige.info")}</p>
              <Link to="/achat?gamme=prestige">
                <Button className="bg-festicup-dark hover:bg-foreground text-white rounded-lg px-5 h-9 text-xs font-medium">{t("gammes.cta.prestige")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GammesSection;
