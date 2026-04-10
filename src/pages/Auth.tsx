import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Mail, Lock, User as UserIcon } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useToast } from "@/hooks/use-toast";

type Mode = "login" | "signup" | "forgot";

const Auth = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "forgot") {
        const { error } = await resetPassword(email);
        if (error) throw error;
        toast({ title: t("auth.resetSent"), description: t("auth.resetSentDesc") });
        setMode("login");
      } else if (mode === "signup") {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast({ title: t("auth.signupSuccess"), description: t("auth.confirmEmail") });
        setMode("login");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/compte");
      }
    } catch (err: any) {
      toast({ title: t("auth.error"), description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-serif font-bold text-foreground">
              {mode === "login" && t("auth.loginTitle")}
              {mode === "signup" && t("auth.signupTitle")}
              {mode === "forgot" && t("auth.forgotTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login" && t("auth.loginSubtitle")}
              {mode === "signup" && t("auth.signupSubtitle")}
              {mode === "forgot" && t("auth.forgotSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="fullName">{t("auth.fullName")}</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" placeholder={t("auth.fullNamePlaceholder")} required />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" placeholder="email@exemple.com" required />
              </div>
            </div>

            {mode !== "forgot" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  {mode === "login" && (
                    <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary hover:underline">
                      {t("auth.forgotLink")}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" placeholder="••••••••" required minLength={8} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "login" && t("auth.loginBtn")}
              {mode === "signup" && t("auth.signupBtn")}
              {mode === "forgot" && t("auth.resetBtn")}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <p>
                {t("auth.noAccount")}{" "}
                <button onClick={() => setMode("signup")} className="text-primary font-medium hover:underline">
                  {t("auth.signupLink")}
                </button>
              </p>
            ) : mode === "signup" ? (
              <p>
                {t("auth.hasAccount")}{" "}
                <button onClick={() => setMode("login")} className="text-primary font-medium hover:underline">
                  {t("auth.loginLink")}
                </button>
              </p>
            ) : (
              <button onClick={() => setMode("login")} className="text-primary font-medium hover:underline">
                {t("auth.backToLogin")}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
