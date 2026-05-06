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
import CheckoutReturn from "./pages/CheckoutReturn";
import Auth from "./pages/Auth";
import Unsubscribe from "./pages/Unsubscribe";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

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
              <Route path="/auth" element={<Auth />} />
              <Route path="/checkout/return" element={<CheckoutReturn />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
