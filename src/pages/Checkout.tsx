import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Lock, Truck, ShieldCheck } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, getPriceForQty, TVA_RATE } from "@/data/products";

const Checkout = () => {
  const { items, totalHT, totalTTC, clearCart } = useCart();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill from profile if logged in
  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (data) {
        setForm((prev) => ({
          ...prev,
          name: data.display_name || prev.name,
          phone: data.phone || prev.phone,
          company: data.company || prev.company,
          email: user.email || prev.email,
          ...((data.default_address as any)?.street ? {
            street: (data.default_address as any).street,
            city: (data.default_address as any).city || prev.city,
            postalCode: (data.default_address as any).postalCode || prev.postalCode,
            country: (data.default_address as any).country || prev.country,
          } : {}),
        }));
      }
    };
    loadProfile();
  }, [user]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    street: "",
    city: "",
    postalCode: "",
    country: "BE",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (items.length === 0) {
    navigate("/panier");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const cartItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productSlug: item.product.slug,
        qty: item.qty,
        mode: item.mode,
        unitPriceHT:
          item.mode === "location"
            ? item.product.locationPriceHT || 0
            : getPriceForQty(item.product, item.qty),
        color: item.color,
        customText: item.customText,
        withLogo: item.withLogo,
      }));

      const res = await fetch(`${supabaseUrl}/functions/v1/create-payment`, {
        method: "POST",
        headers: {
          apikey: anonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          customer: {
            email: form.email,
            name: form.name,
            phone: form.phone,
            company: form.company,
            address: {
              street: form.street,
              city: form.city,
              postalCode: form.postalCode,
              country: form.country,
            },
          },
          totalHT,
          totalTTC,
          userId: user?.id || null,
          redirectUrl: `${window.location.origin}/confirmation`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment creation failed");
      }

      // Redirect to Stripe Checkout
      if (data.checkoutUrl) {
        clearCart();
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Une erreur est survenue");
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="bg-background min-h-screen">
        <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-10">
          <button
            onClick={() => navigate("/panier")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("cart.continue")}
          </button>

          <h1 className="text-2xl lg:text-3xl font-serif font-bold mb-8">
            Finaliser la commande
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left: Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact */}
                <div className="bg-card border border-border rounded-lg p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">
                    Coordonnées
                  </h2>
                  <div className="grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Nom complet *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          className="w-full h-10 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-festicup-gold/50"
                          placeholder="Jean Dupont"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Email *</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className="w-full h-10 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-festicup-gold/50"
                          placeholder="jean@exemple.be"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Téléphone</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className="w-full h-10 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-festicup-gold/50"
                          placeholder="+32 4XX XX XX XX"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Entreprise</label>
                        <input
                          type="text"
                          value={form.company}
                          onChange={(e) => updateField("company", e.target.value)}
                          className="w-full h-10 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-festicup-gold/50"
                          placeholder="Optionnel"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-card border border-border rounded-lg p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">
                    Adresse de livraison
                  </h2>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Rue et numéro *</label>
                      <input
                        type="text"
                        required
                        value={form.street}
                        onChange={(e) => updateField("street", e.target.value)}
                        className="w-full h-10 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-festicup-gold/50"
                        placeholder="Rue de la Loi 1"
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Code postal *</label>
                        <input
                          type="text"
                          required
                          value={form.postalCode}
                          onChange={(e) => updateField("postalCode", e.target.value)}
                          className="w-full h-10 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-festicup-gold/50"
                          placeholder="1000"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Ville *</label>
                        <input
                          type="text"
                          required
                          value={form.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          className="w-full h-10 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-festicup-gold/50"
                          placeholder="Bruxelles"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Pays</label>
                        <select
                          value={form.country}
                          onChange={(e) => updateField("country", e.target.value)}
                          className="w-full h-10 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-festicup-gold/50"
                        >
                          <option value="BE">Belgique</option>
                          <option value="FR">France</option>
                          <option value="NL">Pays-Bas</option>
                          <option value="LU">Luxembourg</option>
                          <option value="DE">Allemagne</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-5 sticky top-24">
                  <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">
                    {t("cart.summary")}
                  </h2>

                  <div className="space-y-2.5 text-sm">
                    {items.map((item) => {
                      const unitPriceHT =
                        item.mode === "location"
                          ? item.product.locationPriceHT || 0
                          : getPriceForQty(item.product, item.qty);
                      return (
                        <div key={item.product.id} className="flex justify-between text-muted-foreground">
                          <span className="truncate max-w-[60%]">
                            {item.product.name} ×{item.qty}
                          </span>
                          <span>{formatPrice(unitPriceHT * item.qty)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-border mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("cart.totalHT")}</span>
                      <span className="font-medium">{formatPrice(totalHT)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("cart.tva")}</span>
                      <span className="font-medium">{formatPrice(totalTTC - totalHT)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                      <span>{t("cart.totalTTC")}</span>
                      <span className="text-festicup-gold">{formatPrice(totalTTC)}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-xs text-destructive">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-5 bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-lg h-12 text-sm font-semibold gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirection vers le paiement...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Payer {formatPrice(totalTTC)} TTC
                      </>
                    )}
                  </Button>

                  <div className="mt-4 space-y-2">
                    {[
                      { icon: Lock, text: "Paiement 100% sécurisé via Mollie" },
                      { icon: Truck, text: "Livraison express 24-48h" },
                      { icon: ShieldCheck, text: "Bancontact · CB · iDEAL · PayPal" },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Icon className="w-3.5 h-3.5 text-festicup-gold flex-shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Checkout;
