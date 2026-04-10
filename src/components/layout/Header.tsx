import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const navLinks = [
  { label: "Achat", href: "/achat" },
  { label: "Location", href: "/location" },
  { label: "Nos solutions PRO", href: "/pro" },
];

const Header = () => {
  const [cartCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-baseline gap-0 shrink-0">
          <span className="text-xl lg:text-2xl font-serif">
            <span className="font-normal">Festi</span>
            <span className="font-bold">cup</span>
            <sup className="text-xs">®</sup>
          </span>
          <span className="hidden lg:block text-[9px] tracking-[0.15em] uppercase text-muted-foreground ml-2">
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
        <div className="flex items-center gap-2 lg:gap-4">
          <button className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors" aria-label="Rechercher">
            <Search className="w-5 h-5" />
          </button>
          <Link to="/compte" className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors" aria-label="Mon compte">
            <User className="w-5 h-5" />
          </Link>
          <Link to="/panier" className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors" aria-label="Panier">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-festicup-gold text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/devis" className="hidden lg:inline-flex">
            <Button className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground rounded-full px-6 text-sm font-medium">
              Demander un devis
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="lg:hidden flex items-center justify-center w-10 h-10" aria-label="Menu">
                <Menu className="w-6 h-6" />
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
