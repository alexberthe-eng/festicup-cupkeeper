import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import StatsSection from "@/components/home/StatsSection";
import BestSellerSection from "@/components/home/BestSellerSection";
import CatalogPreview from "@/components/home/CatalogPreview";
import CtaSection from "@/components/home/CtaSection";
import ReassuranceSection from "@/components/home/ReassuranceSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <BestSellerSection />
      <CatalogPreview />
      <CtaSection />
      <ReassuranceSection />
      <TestimonialsSection />
      <NewsletterSection />
    </Layout>
  );
};

export default Index;
