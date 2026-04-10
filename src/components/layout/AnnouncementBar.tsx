import { useI18n } from "@/contexts/I18nContext";

const AnnouncementBar = () => {
  const { t } = useI18n();
  return (
    <div className="bg-festicup-dark text-white text-center py-2 px-4">
      <p className="text-xs font-medium tracking-wide">
        {t("announce.shipping")} · 
        <span className="text-festicup-gold ml-1">{t("announce.minimum")}</span>
      </p>
    </div>
  );
};

export default AnnouncementBar;
