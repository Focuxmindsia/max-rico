import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X, LogOut, Crown, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { isAdminEmail } from "@/lib/admin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const navLinks = [
  { to: "/catalogo", label: "Catálogo" },
  { to: "/al-por-mayor", label: "Para Negocios" },
  { to: "/socios", label: "Club de Socios" },
  { to: "/sobre-nosotros", label: "Sobre Nosotros" },
  { to: "/blog", label: "Blog" },
  { to: "/empleo", label: "Empleo" },
];

export default function Header() {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const { isSocio } = useSubscription();
  const isAdmin = isAdminEmail(user?.email);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Top bar */}
      <div className="bg-foreground text-background text-xs py-1.5">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span>📦 Envío gratis para socios en pedidos elegibles</span>
          <Link to="/socios" className="underline hover:no-underline font-semibold">
            Hazte socio →
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-lg">​MR</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-xl leading-none">MaxRico</span>
              <span className="block text-[10px] text-muted-foreground tracking-widest uppercase">Porque maxRico somo todos...</span>
            </div>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            <Link to="/socios">
              <Button variant="cta" size="sm" className="hidden sm:inline-flex">
                Hazte socio
              </Button>
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 rounded-md hover:bg-secondary transition-colors relative">
                  <User className="h-5 w-5" />
                  {isSocio && (
                    <Crown className="h-3 w-3 text-primary absolute -top-0.5 -right-0.5 fill-primary" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-xs">
                    <p className="font-semibold truncate">{user.email}</p>
                    {isSocio && (
                      <p className="text-primary font-bold flex items-center gap-1 mt-1">
                        <Crown className="h-3 w-3" /> Socio activo
                      </p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {!isSocio && (
                    <DropdownMenuItem onClick={() => navigate("/socios")}>
                      <Crown className="h-4 w-4 mr-2" /> Hacerme socio
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin/pedidos")}>
                      <ClipboardList className="h-4 w-4 mr-2" /> Panel de pedidos
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="p-2 rounded-md hover:bg-secondary transition-colors">
                <User className="h-5 w-5" />
              </Link>
            )}
            <Link to="/carrito" className="relative p-2 rounded-md hover:bg-secondary transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden p-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-secondary text-sm"
              />
            </div>
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/socios" onClick={() => setMobileOpen(false)}>
              <Button variant="cta" className="w-full mt-2">
                Hazte socio — 59€/año
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
