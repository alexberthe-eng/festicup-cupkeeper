import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { I18nProvider } from "@/contexts/I18nContext";
import Index from "./pages/Index.tsx";
import Achat from "./pages/Achat.tsx";
import Location from "./pages/Location.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Devis from "./pages/Devis.tsx";
import Panier from "./pages/Panier.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/achat" element={<Achat />} />
              <Route path="/location" element={<Location />} />
              <Route path="/produits/:slug" element={<ProductDetail />} />
              <Route path="/devis" element={<Devis />} />
              <Route path="/panier" element={<Panier />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
