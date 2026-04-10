import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import CompteLayout from "@/layouts/CompteLayout";
import { Button } from "@/components/ui/button";
import StatusBadge, { type Status } from "@/components/shared/StatusBadge";
import { useI18n } from "@/contexts/I18nContext";

// Mock data
const mockDevis = [
  { id: "1", ref: "FESTI-2025-0042", date: "2025-03-15", summary: "200× Gobelet Ecocup 30cl, impression logo", value: 580, status: "offer_sent" as Status },
  { id: "2", ref: "FESTI-2025-0038", date: "2025-02-28", summary: "500× Verre Prestige Wine 47cl", value: 2450, status: "pending" as Status },
  { id: "3", ref: "FESTI-2025-0021", date: "2025-01-10", summary: "100× Flûte champagne 12cl + 50× Carafe", value: 420, status: "expired" as Status },
];

const Devis = () => {
  const { t } = useI18n();

  return (
    <CompteLayout>
      <h1 className="text-xl font-serif font-bold text-foreground mb-6">{t("compte.nav.devis")}</h1>

      {mockDevis.length === 0 ? (
        <div className="rounded-xl border border-border p-10 text-center">
          <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground mb-4">{t("devisPage.empty")}</p>
          <Link to="/devis">
            <Button className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-full">{t("devisPage.request")}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {mockDevis.map((d) => (
            <div key={d.id} className="rounded-xl border border-border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-foreground">{d.ref}</span>
                <StatusBadge status={d.status} />
              </div>
              <p className="text-xs text-muted-foreground">{d.date} — {d.summary}</p>
              <div className="flex items-center justify-between pt-1 border-t border-border">
                <span className="text-sm text-muted-foreground">{t("devisPage.estimatedValue")}</span>
                <span className="font-semibold text-foreground">{d.value.toFixed(2)} €</span>
              </div>
              {d.status === "offer_sent" && (
                <Link to="/devis/accepter/demo-token">
                  <Button size="sm" className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-full text-xs mt-1">
                    {t("devisPage.viewAccept")} →
                  </Button>
                </Link>
              )}
              {d.status === "expired" && (
                <Link to="/devis">
                  <Button size="sm" variant="outline" className="rounded-full text-xs mt-1">{t("devisPage.renew")}</Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </CompteLayout>
  );
};

export default Devis;
