import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const quickLinks = [
  { label: "Location gobelets", href: "/produits?type=location" },
  { label: "Boutique en ligne", href: "/produits" },
  { label: "Service client", href: "/contact" },
  { label: "À propos", href: "/a-propos" },
  { label: "Blog Éco-responsable", href: "/blog" },
];

const legalLinks = [
  { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "CGV", href: "/cgv" },
  { label: "Paiement sécurisé", href: "#" },
];

const serviceLinks = [
  { label: "Gobelets personnalisés", href: "/produits" },
  { label: "Location événementielle", href: "/produits?type=location" },
  { label: "Solution entreprise", href: "/pro" },
  { label: "Demander un devis", href: "/devis" },
];

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      {/* Desktop */}
      <div className="container py-16 hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1 - Brand */}
        <div>
          <div className="mb-4">
            <span className="text-xl font-serif font-bold text-primary">
              Festicup<sup className="text-xs">®</sup>
            </span>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
              Premium Brand of Re-uz
            </p>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Des gobelets réutilisables et personnalisés pour tous vos événements.
          </p>
          <span className="inline-block text-xs uppercase tracking-widest bg-success/20 text-success px-3 py-1 rounded-full font-semibold mb-4">
            100% éco-responsable
          </span>
          <div className="flex gap-3 mt-2">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground mb-4 font-sans">
            Liens rapides
          </h4>
          <ul className="space-y-2">
            {[...quickLinks, ...legalLinks].map((link) => (
              <li key={link.href + link.label}>
                <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground mb-4 font-sans">
            Nos services
          </h4>
          <ul className="space-y-2">
            {serviceLinks.map((link) => (
              <li key={link.href + link.label}>
                <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground mb-4 font-sans">
            Contact
          </h4>
          <address className="not-italic text-sm text-muted-foreground space-y-2">
            <p>Festicup® — Re-uz</p>
            <p>Belgique</p>
            <p>
              <a href="tel:+3200000000" className="hover:text-primary transition-colors">
                +32 (0) 00 000 000
              </a>
            </p>
            <p className="pt-2 text-xs">
              Lun – Ven : 8h30 – 12h30 / 14h – 17h
            </p>
          </address>
        </div>
      </div>

      {/* Mobile Accordion */}
      <div className="container py-8 md:hidden">
        <div className="mb-6 text-center">
          <span className="text-xl font-serif font-bold text-primary">
            Festicup<sup className="text-xs">®</sup>
          </span>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
            Premium Brand of Re-uz
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
          </div>
        </div>
        <Accordion type="multiple">
          <AccordionItem value="links">
            <AccordionTrigger className="text-sm font-semibold uppercase tracking-widest text-foreground font-sans">
              Liens rapides
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {quickLinks.map((l) => (
                  <li key={l.href}><Link to={l.href} className="text-sm text-muted-foreground hover:text-primary">{l.label}</Link></li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="services">
            <AccordionTrigger className="text-sm font-semibold uppercase tracking-widest text-foreground font-sans">
              Nos services
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {serviceLinks.map((l) => (
                  <li key={l.href}><Link to={l.href} className="text-sm text-muted-foreground hover:text-primary">{l.label}</Link></li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="contact">
            <AccordionTrigger className="text-sm font-semibold uppercase tracking-widest text-foreground font-sans">
              Contact
            </AccordionTrigger>
            <AccordionContent>
              <address className="not-italic text-sm text-muted-foreground space-y-2">
                <p>Festicup® — Re-uz · Belgique</p>
                <p>+32 (0) 00 000 000</p>
                <p className="text-xs">Lun – Ven : 8h30 – 12h30 / 14h – 17h</p>
              </address>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border py-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Festicup® — Tous droits réservés</p>
          <div className="flex gap-4">
            <Link to="/cgv" className="hover:text-primary transition-colors">CGV</Link>
            <Link to="/mentions-legales" className="hover:text-primary transition-colors">Mentions légales</Link>
            <Link to="/politique-de-confidentialite" className="hover:text-primary transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
