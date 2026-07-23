import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import CatalogoPublico from "./pages/CatalogoPublico";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Socios from "./pages/Socios";
import AboutUs from "./pages/AboutUs";
import AlPorMayor from "./pages/AlPorMayor";
import Empleo from "./pages/Empleo";
import Cuenta from "./pages/Cuenta";
import CheckoutReturn from "./pages/CheckoutReturn";
import Auth from "./pages/Auth";
import Unsubscribe from "./pages/Unsubscribe";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminOrders from "./pages/AdminOrders";
import NotFound from "./pages/NotFound";
import TestPago from "./pages/TestPago";
import OAuthConsent from "./pages/OAuthConsent";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import CookieBanner from "@/components/CookieBanner";
import LegalTerminos from "./pages/legal/Terminos";
import LegalPrivacidad from "./pages/legal/Privacidad";
import LegalAviso from "./pages/legal/AvisoLegal";
import LegalCookies from "./pages/legal/Cookies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PaymentTestModeBanner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalogo" element={<CatalogoPublico />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/socios" element={<Socios />} />
              <Route path="/sobre-nosotros" element={<AboutUs />} />
              <Route path="/al-por-mayor" element={<AlPorMayor />} />
              <Route path="/empleo" element={<Empleo />} />
              <Route path="/cuenta" element={<Cuenta />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/checkout/return" element={<CheckoutReturn />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/admin/pedidos" element={<AdminOrders />} />
              <Route path="/legal/terminos" element={<LegalTerminos />} />
              <Route path="/legal/privacidad" element={<LegalPrivacidad />} />
              <Route path="/legal/aviso-legal" element={<LegalAviso />} />
              <Route path="/legal/cookies" element={<LegalCookies />} />
              <Route path="/test-pago" element={<TestPago />} />
              <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieBanner />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

