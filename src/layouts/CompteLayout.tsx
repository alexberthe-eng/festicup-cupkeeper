import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Package, FileText, MapPin, LogOut } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const navItems = [
  { icon: User, labelKey: "compte.nav.infos", href: "/compte/infos" },
  { icon: Package, labelKey: "compte.nav.commandes", href: "/compte/commandes" },
  { icon: FileText, labelKey: "compte.nav.devis", href: "/compte/devis" },
  { icon: MapPin, labelKey: "compte.nav.adresses", href: "/compte/adresses" },
];

const CompteLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="sticky top-24 space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "text-festicup-gold bg-festicup-gold/5 border-l-2 border-festicup-gold"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-secondary transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                {t("account.logout")}
              </button>
            </nav>
          </aside>

          {/* Mobile tabs */}
          <div className="lg:hidden overflow-x-auto -mx-4 px-4">
            <div className="flex gap-1 min-w-max">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      active
                        ? "bg-festicup-gold/10 text-festicup-gold"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompteLayout;
