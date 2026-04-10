import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";
import CompteLayout from "@/layouts/CompteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Infos = () => {
  const { user, loading: authLoading, updatePassword } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Password
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  // Delete modal
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setDisplayName(data.display_name || "");
        setPhone(data.phone || "");
        setCompany(data.company || "");
      }
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ display_name: displayName, phone, company }).eq("user_id", user.id);
    if (error) toast({ title: t("auth.error"), description: error.message, variant: "destructive" });
    else toast({ title: t("account.saved") });
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPw !== confirmPw) {
      toast({ title: t("auth.error"), description: t("auth.passwordMismatch"), variant: "destructive" });
      return;
    }
    setChangingPw(true);
    const { error } = await updatePassword(newPw);
    if (error) toast({ title: t("auth.error"), description: (error as any).message, variant: "destructive" });
    else { toast({ title: t("auth.passwordUpdated") }); setOldPw(""); setNewPw(""); setConfirmPw(""); }
    setChangingPw(false);
  };

  if (authLoading || loading) {
    return <CompteLayout><div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div></CompteLayout>;
  }

  return (
    <CompteLayout>
      <h1 className="text-xl font-serif font-bold text-foreground mb-6">{t("compte.nav.infos")}</h1>

      {/* Personal info */}
      <div className="rounded-xl border border-border p-6 space-y-4 mb-6">
        <h2 className="text-sm font-semibold text-foreground">{t("infos.personal")}</h2>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
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
        <Button onClick={handleSave} disabled={saving} className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-full">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {t("account.save")}
        </Button>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-border p-6 space-y-4 mb-6">
        <h2 className="text-sm font-semibold text-foreground">{t("infos.security")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>{t("infos.newPassword")}</Label>
            <div className="relative">
              <Input type={showPw ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)} minLength={8} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>{t("auth.confirmPassword")}</Label>
            <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} minLength={8} />
          </div>
        </div>
        <Button onClick={handleChangePassword} disabled={changingPw || !newPw} variant="outline" className="rounded-full">
          {changingPw && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {t("infos.changePassword")}
        </Button>
      </div>

      {/* Delete account */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <button className="text-xs text-destructive hover:underline">{t("infos.deleteAccount")}</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("infos.deleteAccount")}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">{t("infos.deleteConfirmText")}</p>
          <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder={t("infos.deleteConfirmPlaceholder")} />
          <Button variant="destructive" disabled={deleteConfirm !== "SUPPRIMER"} className="mt-3 w-full">{t("infos.deleteAccount")}</Button>
        </DialogContent>
      </Dialog>
    </CompteLayout>
  );
};

export default Infos;
