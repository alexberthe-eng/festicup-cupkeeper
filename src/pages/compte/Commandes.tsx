import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Package } from "lucide-react";
import CompteLayout from "@/layouts/CompteLayout";
import { Button } from "@/components/ui/button";
import StatusBadge, { type Status } from "@/components/shared/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_ttc: number;
  items: any;
  created_at: string;
}

const Commandes = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("id, order_number, status, total_ttc, items, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data || []);
        setLoading(false);
      });
  }, [user]);

  if (authLoading || loading) {
    return <CompteLayout><div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div></CompteLayout>;
  }

  return (
    <CompteLayout>
      <h1 className="text-xl font-serif font-bold text-foreground mb-6">{t("compte.nav.commandes")}</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-border p-10 text-center">
          <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground mb-4">{t("account.noOrders")}</p>
          <Link to="/achat">
            <Button className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-full">{t("commandes.discover")}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            return (
              <div key={order.id} className="rounded-xl border border-border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-foreground">{order.order_number}</span>
                  <StatusBadge status={order.status as Status} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()} — {items.length} {items.length > 1 ? t("account.items") : t("account.item")}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <span className="text-sm text-muted-foreground">{t("checkout.totalTTC")}</span>
                  <span className="font-semibold text-foreground">{Number(order.total_ttc).toFixed(2)} €</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CompteLayout>
  );
};

export default Commandes;
