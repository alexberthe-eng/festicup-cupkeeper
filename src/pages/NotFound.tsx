import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useI18n();

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-md space-y-4">
          <h1 className="text-7xl font-serif font-bold text-foreground">404</h1>
          <h2 className="text-xl font-serif font-semibold text-foreground">{t("notFound.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("notFound.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link to="/">
              <Button className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-full px-6">
                {t("notFound.home")}
              </Button>
            </Link>
            <Link to="/achat">
              <Button variant="outline" className="rounded-full px-6">
                {t("notFound.catalog")}
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
