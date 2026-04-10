import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-festicup-dark-alt text-white">
      {/* Réassurance band */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🚚", title: "Livraison express", desc: "En 24h partout en Belgique" },
            { icon: "👤", title: "Service client", desc: "Conseils d'experts dédiés" },
            { icon: "📦", title: "Livraison gratuite", desc: "Dès 3 packs commandés" },
            { icon: "♻️", title: "Produits durables", desc: "100% éco-responsables" },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center gap-2">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-semibold">{item.title}</span>
              <span className="text-xs text-white/60">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 - Logo & tagline */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-serif text-white">
                <span className="font-normal">Festi</span>
                <span className="font-bold">cup</span>
                <sup className="text-xs">®</sup>
              </span>
            </Link>
            <p className="text-[10px] uppercase tracking-widest text-white/50 mb-3">Premium brand of Re-uz</p>
            <p className="text-sm text-white/70 mb-4">
              Votre partenaire de confiance pour des événements éco-responsables et mémorables.
            </p>
            <span className="inline-block bg-festicup-gold/20 text-festicup-gold text-xs font-medium px-3 py-1 rounded-full">
              100% éco-responsable
            </span>
          </div>

          {/* Col 2 - Liens rapides */}
          <div>
            <h4 className="font-sans text-sm font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              {["Location de gobelets", "Boutique en ligne", "Service client", "À propos", "Blog Éco-responsable", "Politique de confidentialité des données", "Mentions légales", "Abus et contrefaçon", "Conditions Générales d'utilisation B2B", "Paiement sécurisé"].map((text) => (
                <li key={text}>
                  <Link to="#" className="hover:text-festicup-gold transition-colors">{text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Nos services */}
          <div>
            <h4 className="font-sans text-sm font-semibold mb-4">Nos services</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              {["Location de gobelets", "Boutique en ligne", "Service client", "À propos", "Nous contacter", "Blog Éco-responsable", "Politique de confidentialité des cookies", "Mentions légales", "Marques propres", "Conditions Générales d'utilisation B2C", "Paiement sécurisé"].map((text, i) => (
                <li key={i}>
                  <Link to="#" className="hover:text-festicup-gold transition-colors">{text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - Contact + Newsletter */}
          <div>
            <h4 className="font-sans text-sm font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-white/60 mb-6">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Chemin du Vieux Robert, 09 à 6000 Bruxelles</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+32 4 93 12 00 01</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>contact@festicup.be</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Lun – Ven : 8h30 – 12h30 / 14h – 17h</span>
              </li>
            </ul>

            <h4 className="font-sans text-sm font-semibold mb-3">Rejoignez le mouvement :</h4>
            <p className="text-xs text-white/50 mb-3">Recevez nos conseils et offres exclusives</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Adresse mail"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm h-9 rounded-md"
              />
              <Button className="bg-festicup-gold hover:bg-festicup-gold-dark text-foreground text-sm h-9 px-4 rounded-md shrink-0">
                S'abonner
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span>🔒 Paiement sécurisé</span>
            <span className="font-bold text-white/70 ml-2">VISA</span>
            <span className="font-bold text-white/70">MC</span>
            <span className="font-bold text-white/70">PayPal</span>
          </div>
          <p className="text-xs text-white/50">
            Paiement en 3x ou 4x sans frais avec <span className="text-festicup-gold font-medium">Alma</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
