import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import GammesSection from "@/components/home/GammesSection";
import ConfigurateurSection from "@/components/home/ConfigurateurSection";
import SimpleParNatureSection from "@/components/home/SimpleParNatureSection";
import ReassuranceDarkSection from "@/components/home/ReassuranceDarkSection";
import ChiffresSection from "@/components/home/ChiffresSection";
import FAQSection from "@/components/home/FAQSection";
import AvisSection from "@/components/home/AvisSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <GammesSection />
        <ConfigurateurSection />
        <SimpleParNatureSection />
        <ReassuranceDarkSection />
        <ChiffresSection />
        <FAQSection />
        <AvisSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
