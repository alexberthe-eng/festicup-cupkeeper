import { useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import CompteLayout from "@/layouts/CompteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/contexts/I18nContext";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  { id: "1", name: "Alexandre Berthe", street: "5 Vieux Chemin de Mons", city: "Vaulx", postalCode: "7536", country: "BE", phone: "+32 494 23 82 65", isDefault: true },
  { id: "2", name: "AMB Group - Bureau", street: "Rue de la Station 12", city: "Bruxelles", postalCode: "1000", country: "BE", phone: "+32 2 123 45 67", isDefault: false },
];

const Adresses = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", street: "", city: "", postalCode: "", country: "BE", phone: "" });

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    toast({ title: t("adresses.defaultUpdated") });
  };

  const remove = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const addAddress = () => {
    if (!form.name || !form.street) return;
    setAddresses((prev) => [...prev, { ...form, id: Date.now().toString(), isDefault: false }]);
    setForm({ name: "", street: "", city: "", postalCode: "", country: "BE", phone: "" });
    setShowForm(false);
    toast({ title: t("adresses.added") });
  };

  return (
    <CompteLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-serif font-bold text-foreground">{t("compte.nav.adresses")}</h1>
        <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-3.5 h-3.5 mr-1" /> {t("adresses.add")}
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-border p-5 mb-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label className="text-xs">{t("auth.fullName")}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className="text-xs">{t("account.phone")}</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">{t("checkout.street")}</Label><Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className="text-xs">{t("checkout.city")}</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className="text-xs">{t("checkout.postalCode")}</Label><Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} /></div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-full" onClick={addAddress}>{t("account.save")}</Button>
            <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setShowForm(false)}>{t("adresses.cancel")}</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className="rounded-xl border border-border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-foreground">{addr.name}</span>
              {addr.isDefault && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-festicup-gold/10 text-festicup-gold">{t("adresses.default")}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{addr.street}, {addr.postalCode} {addr.city}, {addr.country}</p>
            <p className="text-xs text-muted-foreground">{addr.phone}</p>
            <div className="flex gap-2 pt-1">
              {!addr.isDefault && (
                <Button size="sm" variant="outline" className="rounded-full text-xs h-7" onClick={() => setDefault(addr.id)}>{t("adresses.setDefault")}</Button>
              )}
              <Button size="sm" variant="ghost" className="rounded-full text-xs h-7 text-destructive hover:text-destructive" onClick={() => remove(addr.id)}>
                <Trash2 className="w-3 h-3 mr-1" /> {t("adresses.delete")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CompteLayout>
  );
};

export default Adresses;
