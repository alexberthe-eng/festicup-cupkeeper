import { Link } from "react-router-dom";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { label: "Achat", href: "/achat" },
  { label: "Location", href: "/location" },
  { label: "Nos solutions PRO", href: "/pro" },
];

const Header = () => {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-14 lg:h-[72px]">
        {/* Logo */}
        <Link to="/" className="flex items-baseline gap-0 shrink-0">
          <span className="text-xl lg:text-2xl font-serif">
            <span className="font-normal">Festi</span>
            <span className="font-bold">cup</span>
            <sup className="text-[9px] ml-0.5">®</sup>
          </span>
          <span className="hidden lg:block text-[8px] tracking-[0.18em] uppercase text-muted-foreground ml-2 font-sans">
            Premium brand of Re-uz
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-foreground hover:text-festicup-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1 lg:gap-3">
          <Link to="/devis" className="hidden lg:inline-flex">
            <Button className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-full px-5 h-9 text-sm font-medium">
              Demander un devis
            </Button>
          </Link>
          <button className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full hover:bg-secondary transition-colors" aria-label="Rechercher">
            <Search className="w-[18px] h-[18px]" />
          </button>
          <Link to="/compte" className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full hover:bg-secondary transition-colors" aria-label="Mon compte">
            <User className="w-[18px] h-[18px]" />
          </Link>
          <Link to="/panier" className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-secondary transition-colors" aria-label="Panier">
            <ShoppingBag className="w-[18px] h-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-festicup-gold text-primary-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile: CTA devis */}
          <Link to="/devis" className="lg:hidden">
            <Button className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-full px-4 h-8 text-xs font-medium">
              Demander un devis
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="lg:hidden flex items-center justify-center w-9 h-9" aria-label="Menu">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <div className="flex flex-col h-full pt-12 px-6">
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        to={link.href}
                        className="text-lg font-medium py-3 border-b border-border"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="flex flex-col gap-3 mt-8">
                  <SheetClose asChild>
                    <Link to="/devis">
                      <Button className="w-full bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-full">
                        Demander un devis
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/compte">
                      <Button variant="outline" className="w-full rounded-full">
                        Mon compte
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
