import { useSearchParams, Link } from "react-router-dom";
import { Clock, FileText, Download } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

// Mock quote data
const mockQuote = {
  ref: "FESTI-2025-0042",
  validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  items: [
    { name: "Gobelet Ecocup 30cl", qty: 200, color: "Blanc", impression: "Logo 1 couleur", unitPrice: 1.85, subtotal: 370 },
    { name: "Gobelet Ecocup 50cl", qty: 100, color: "Transparent", impression: "Sans", unitPrice: 2.10, subtotal: 210 },
  ],
  totalHT: 580,
  tva: 121.80,
  totalTTC: 701.80,
};

const DevisAcceptation = () => {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const isExpired = searchParams.get("expired") === "true";

  if (isExpired) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="text-center max-w-md space-y-4">
            <Clock className="w-16 h-16 mx-auto text-destructive" />
            <h1 className="text-xl font-serif font-bold text-foreground">{t("devisAccept.expired")}</h1>
            <p className="text-sm text-muted-foreground">{t("devisAccept.expiredDesc")}</p>
            <a href="mailto:contact@festicup.be">
              <Button className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-full">{t("devisAccept.contact")}</Button>
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-2xl font-serif">
            <span className="font-normal">Festi</span><span className="font-bold">cup</span><sup className="text-[9px] ml-0.5">®</sup>
          </span>
        </div>

        <div className="bg-background rounded-2xl border border-border shadow-lg p-6 lg:p-8 space-y-6">
          {/* Validity badge */}
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-serif font-bold text-foreground">{t("devisAccept.title")} {mockQuote.ref}</h1>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-festicup-gold/10 text-festicup-gold">
              {t("devisAccept.validUntil")} {mockQuote.validUntil}
            </span>
          </div>

          {/* Products table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">{t("devisAccept.product")}</th>
                  <th className="pb-2 font-medium text-center">{t("devisAccept.qty")}</th>
                  <th className="pb-2 font-medium">{t("devisAccept.color")}</th>
                  <th className="pb-2 font-medium">{t("devisAccept.impression")}</th>
                  <th className="pb-2 font-medium text-right">{t("devisAccept.unitPrice")}</th>
                  <th className="pb-2 font-medium text-right">{t("devisAccept.subtotal")}</th>
                </tr>
              </thead>
              <tbody>
                {mockQuote.items.map((item, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 font-medium text-foreground">{item.name}</td>
                    <td className="py-3 text-center">{item.qty}</td>
                    <td className="py-3 text-muted-foreground">{item.color}</td>
                    <td className="py-3 text-muted-foreground">{item.impression}</td>
                    <td className="py-3 text-right">{item.unitPrice.toFixed(2)} €</td>
                    <td className="py-3 text-right font-medium">{item.subtotal.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-1 text-sm border-t border-border pt-4">
            <div className="flex justify-between"><span className="text-muted-foreground">{t("cart.totalHT")}</span><span>{mockQuote.totalHT.toFixed(2)} €</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("cart.tva")}</span><span>{mockQuote.tva.toFixed(2)} €</span></div>
            <div className="flex justify-between font-bold text-base pt-1"><span>{t("cart.totalTTC")}</span><span>{mockQuote.totalTTC.toFixed(2)} €</span></div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="outline" className="rounded-full flex-1 gap-2">
              <Download className="w-4 h-4" /> {t("devisAccept.downloadPDF")}
            </Button>
            <Link to="/checkout" className="flex-1">
              <Button className="w-full bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-full">
                {t("devisAccept.acceptPay")}
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <a href="mailto:contact@festicup.be" className="text-xs text-muted-foreground hover:text-festicup-gold transition-colors">
              {t("devisAccept.requestChange")}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DevisAcceptation;
