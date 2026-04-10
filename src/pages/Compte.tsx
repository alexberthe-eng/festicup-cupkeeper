import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, User as UserIcon, Package, LogOut, Save } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  display_name: string | null;
  phone: string | null;
  company: string | null;
  default_address: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  } | null;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_ttc: number;
  items: any;
  created_at: string;
}

const Compte = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("BE");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoadingProfile(true);

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData as any);
        setDisplayName(profileData.display_name || "");
        setPhone(profileData.phone || "");
        setCompany(profileData.company || "");
        const addr = profileData.default_address as any;
        if (addr) {
          setStreet(addr.street || "");
          setCity(addr.city || "");
          setPostalCode(addr.postalCode || "");
          setCountry(addr.country || "BE");
        }
      }

      // Fetch orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("id, order_number, status, total_ttc, items, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersData) {
        setOrders(ordersData);
      }

      setLoadingProfile(false);
    };

    fetchData();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        phone,
        company,
        default_address: { street, city, postalCode, country },
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: t("auth.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("account.saved") });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-secondary text-muted-foreground";
    }
  };

  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif font-bold text-foreground">{t("account.title")}</h1>
          <Button variant="ghost" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            {t("account.logout")}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              {t("account.profile")}
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              {t("account.orders")}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="rounded-xl border border-border p-6 space-y-4">
              <p className="text-sm text-muted-foreground">{user?.email}</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("auth.fullName")}</Label>
                  <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("account.phone")}</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+32 ..." />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>{t("account.company")}</Label>
                  <Input value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                <h3 className="text-sm font-medium text-foreground">{t("account.defaultAddress")}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>{t("checkout.street")}</Label>
                    <Input value={street} onChange={(e) => setStreet(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("checkout.city")}</Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("checkout.postalCode")}</Label>
                    <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={saving} className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-full">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {t("account.save")}
              </Button>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <div className="rounded-xl border border-border p-8 text-center text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>{t("account.noOrders")}</p>
              </div>
            ) : (
              orders.map((order) => {
                const items = Array.isArray(order.items) ? order.items : [];
                return (
                  <div key={order.id} className="rounded-xl border border-border p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-foreground">{order.order_number}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(order.status)}`}>
                        {t(`order.status.${order.status}`)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()} — {items.length} {t("account.item", { count: items.length })}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-border">
                      <span className="text-sm text-muted-foreground">{t("checkout.totalTTC")}</span>
                      <span className="font-semibold text-foreground">{Number(order.total_ttc).toFixed(2)} €</span>
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Compte;
