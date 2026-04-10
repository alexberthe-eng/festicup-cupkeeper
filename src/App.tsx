import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Achat from "./pages/Achat.tsx";
import Location from "./pages/Location.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Devis from "./pages/Devis.tsx";
import Panier from "./pages/Panier.tsx";
import Checkout from "./pages/Checkout.tsx";
import Confirmation from "./pages/Confirmation.tsx";
import Auth from "./pages/Auth.tsx";
import { Navigate } from "react-router-dom";
import ResetPassword from "./pages/ResetPassword.tsx";
import CompteInfos from "./pages/compte/Infos.tsx";
import CompteCommandes from "./pages/compte/Commandes.tsx";
import CompteDevis from "./pages/compte/Devis.tsx";
import CompteAdresses from "./pages/compte/Adresses.tsx";
import DevisAcceptation from "./pages/DevisAcceptation.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <AuthProvider>
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
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/compte" element={<Navigate to="/compte/infos" replace />} />
                <Route path="/compte/infos" element={<CompteInfos />} />
                <Route path="/compte/commandes" element={<CompteCommandes />} />
                <Route path="/compte/devis" element={<CompteDevis />} />
                <Route path="/compte/adresses" element={<CompteAdresses />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/devis/accepter/:token" element={<DevisAcceptation />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
