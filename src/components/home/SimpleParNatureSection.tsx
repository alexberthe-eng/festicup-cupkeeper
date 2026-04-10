import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";

const SimpleParNatureSection = () => {
  const { t } = useI18n();
  const [mode, setMode] = useState<"achat" | "location">("achat");

  const stepsAchat = [
    { num: "1", title: t("simple.achat.step1.title"), desc: t("simple.achat.step1.desc") },
    { num: "2", title: t("simple.achat.step2.title"), desc: t("simple.achat.step2.desc") },
    { num: "3", title: t("simple.achat.step3.title"), desc: t("simple.achat.step3.desc") },
    { num: "4", title: t("simple.achat.step4.title"), desc: t("simple.achat.step4.desc") },
    { num: "5", title: t("simple.achat.step5.title"), desc: t("simple.achat.step5.desc") },
  ];

  const stepsLocation = [
    { num: "1", title: t("simple.location.step1.title"), desc: t("simple.location.step1.desc") },
    { num: "2", title: t("simple.location.step2.title"), desc: t("simple.location.step2.desc") },
    { num: "3", title: t("simple.location.step3.title"), desc: t("simple.location.step3.desc") },
    { num: "4", title: t("simple.location.step4.title"), desc: t("simple.location.step4.desc") },
    { num: "5", title: t("simple.location.step5.title"), desc: t("simple.location.step5.desc") },
  ];

  const steps = mode === "achat" ? stepsAchat : stepsLocation;

  return (
    <section className="py-14 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          <div className="flex-1 w-full">
            <h2 className="text-2xl lg:text-4xl font-serif font-bold mb-6">{t("simple.title")}</h2>
            <div className="inline-flex bg-secondary rounded-full p-1 mb-6">
              <button onClick={() => setMode("achat")} className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${mode === "achat" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t("simple.achat")}</button>
              <button onClick={() => setMode("location")} className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${mode === "location" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t("simple.location")}</button>
            </div>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.num} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full border-2 border-festicup-gold flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-festicup-gold">{step.num}</span>
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-sm mb-0.5">{step.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative w-full">
            <div className="rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" alt="Entrepôt Festicup" className="w-full h-[320px] lg:h-[460px] object-cover" />
            </div>
            <div className="absolute bottom-4 left-3 right-3 lg:left-5 lg:right-5 bg-background/95 backdrop-blur-sm rounded-xl shadow-xl border border-border p-4">
              <p className="font-sans font-semibold text-xs mb-0.5">{t("simple.caution.title")}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{t("simple.caution.desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleParNatureSection;
