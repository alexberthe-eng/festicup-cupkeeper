import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { label: "Nos gobelets", href: "/produits" },
  { label: "Location", href: "/produits?type=location" },
  { label: "Solution PRO", href: "/pro" },
  { label: "Devis", href: "/devis" },
  { label: "Blog", href: "/blog" },
  { label: "À propos", href: "/a-propos" },
];

const Header = () => {
  const [cartCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start">
          <span className="text-xl font-serif font-bold text-primary tracking-wide">
            Festicup<sup className="text-xs">®</sup>
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground -mt-1">
            Premium Brand of Re-uz
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link to="/compte">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/panier" className="relative">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border w-72">
              <SheetTitle className="text-foreground font-serif">Menu</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-base font-medium text-muted-foreground hover:text-primary transition-colors py-2 border-b border-border"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
