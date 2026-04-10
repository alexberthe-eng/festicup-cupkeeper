import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Package, Mail } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  total_ht: number;
  total_ttc: number;
  status: string;
  items: any[];
  created_at: string;
}

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (data) {
        setOrder(data as Order);
        // If still pending and we haven't polled too much, retry
        if (data.status === "pending" && pollCount < 10) {
          setTimeout(() => setPollCount((c) => c + 1), 2000);
        }
      }
      setIsLoading(false);
    };

    fetchOrder();
  }, [orderId, pollCount]);

  const isPaid = order?.status === "paid";
  const isCancelled = order?.status === "cancelled";
  const isPending = order?.status === "pending";

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="bg-background min-h-[60vh]">
        <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-festicup-gold" />
              <p className="text-muted-foreground">Vérification du paiement...</p>
            </div>
          ) : !order ? (
            <div className="text-center">
              <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-serif font-bold mb-2">Commande introuvable</h1>
              <p className="text-muted-foreground mb-6">Nous n'avons pas trouvé cette commande.</p>
              <Button asChild>
                <Link to="/achat">Retour au catalogue</Link>
              </Button>
            </div>
          ) : isPaid ? (
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold mb-2">
                Merci pour votre commande !
              </h1>
              <p className="text-muted-foreground mb-6">
                Votre commande <span className="font-semibold text-foreground">{order.order_number}</span> a été confirmée.
              </p>

              <div className="bg-card border border-border rounded-lg p-5 text-left space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-festicup-gold" />
                  <div>
                    <p className="text-sm font-medium">Confirmation envoyée</p>
                    <p className="text-xs text-muted-foreground">Un email a été envoyé à {order.customer_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-festicup-gold" />
                  <div>
                    <p className="text-sm font-medium">Livraison sous 24-48h</p>
                    <p className="text-xs text-muted-foreground">Vous recevrez un email avec le suivi de colis</p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Total TTC</span>
                  <span className="font-bold text-festicup-gold">{order.total_ttc.toFixed(2).replace(".", ",")}€</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{order.items?.length || 0} article(s)</span>
                  <span>Payé par carte</span>
                </div>
              </div>

              <Button asChild className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground">
                <Link to="/">Retour à l'accueil</Link>
              </Button>
            </div>
          ) : isCancelled ? (
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-serif font-bold mb-2">Paiement annulé</h1>
              <p className="text-muted-foreground mb-6">
                Le paiement pour la commande {order.order_number} a été annulé ou a expiré.
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link to="/panier">Retour au panier</Link>
                </Button>
                <Button asChild className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground">
                  <Link to="/achat">Continuer mes achats</Link>
                </Button>
              </div>
            </div>
          ) : isPending ? (
            <div className="max-w-lg mx-auto text-center">
              <Loader2 className="w-10 h-10 animate-spin text-festicup-gold mx-auto mb-4" />
              <h1 className="text-2xl font-serif font-bold mb-2">Paiement en cours de vérification...</h1>
              <p className="text-muted-foreground mb-6">
                Commande {order.order_number} — Nous attendons la confirmation de votre paiement.
                Cette page se met à jour automatiquement.
              </p>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Confirmation;
