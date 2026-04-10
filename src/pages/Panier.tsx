import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, FileText, ArrowLeft, Package } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import {
  formatPrice,
  getPriceForQty,
  getPriceTTC,
  isAboveQuoteThreshold,
  TVA_RATE,
} from "@/data/products";

const Panier = () => {
  const { items, removeItem, updateQty, clearCart, totalHT, totalTTC, itemCount, hasQuoteItems } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="bg-background min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="w-7 h-7 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-serif font-bold mb-2">Votre panier est vide</h1>
            <p className="text-sm text-muted-foreground max-w-sm">
              Parcourez notre catalogue pour ajouter des gobelets réutilisables à votre panier.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/achat">Catalogue Achat</Link>
            </Button>
            <Button asChild className="bg-festicup-gold hover:bg-festicup-gold/90 text-white">
              <Link to="/location">Catalogue Location</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="bg-background min-h-screen">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 lg:px-8 pt-6">
          <Link to="/achat" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Continuer mes achats
          </Link>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-10">
          <h1 className="text-2xl lg:text-3xl font-serif font-bold mb-6">
            Mon panier <span className="text-base font-sans font-normal text-muted-foreground">({itemCount} articles)</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const unitPriceHT =
                  item.mode === "location"
                    ? item.product.locationPriceHT || 0
                    : getPriceForQty(item.product, item.qty);
                const lineTotalHT = unitPriceHT * item.qty;
                const isQuote = isAboveQuoteThreshold(item.qty);

                return (
                  <div
                    key={item.product.id}
                    className="bg-card border border-border rounded-lg p-4 lg:p-5 flex gap-4"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold leading-tight">{item.product.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                              {item.mode === "location" ? "Location" : "Achat"}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                              {item.product.capacity}
                            </span>
                            {item.color && (
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-border"
                                style={{ backgroundColor: item.color }}
                              />
                            )}
                          </div>
                          {item.customText && (
                            <p className="text-[11px] text-muted-foreground mt-1 truncate max-w-[200px]">
                              Personnalisation : {item.customText}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Qty + Price */}
                      <div className="flex items-end justify-between mt-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQty(item.product.id, item.qty - item.product.minQty)}
                            disabled={item.qty <= item.product.minQty}
                            className="w-7 h-7 rounded border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-12 text-center text-sm font-medium">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.product.id, item.qty + 25)}
                            className="w-7 h-7 rounded border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(unitPriceHT)} HT/pièce
                            {item.mode === "location" ? "/jour" : ""}
                          </p>
                          <p className="text-sm font-bold">{formatPrice(lineTotalHT)} HT</p>
                        </div>
                      </div>

                      {isQuote && (
                        <div className="mt-2 px-2 py-1 bg-festicup-gold/10 border border-festicup-gold/30 rounded text-[10px] text-festicup-gold font-medium flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Quantité soumise à devis personnalisé
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={clearCart}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors mt-2"
              >
                Vider le panier
              </button>
            </div>

            {/* Summary sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-5 sticky top-24">
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Récapitulatif</h2>

                <div className="space-y-2.5 text-sm">
                  {items.map((item) => {
                    const unitPriceHT =
                      item.mode === "location"
                        ? item.product.locationPriceHT || 0
                        : getPriceForQty(item.product, item.qty);
                    return (
                      <div key={item.product.id} className="flex justify-between text-muted-foreground">
                        <span className="truncate max-w-[60%]">
                          {item.product.name} ×{item.qty}
                        </span>
                        <span>{formatPrice(unitPriceHT * item.qty)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-border mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total HT</span>
                    <span className="font-medium">{formatPrice(totalHT)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">TVA (21%)</span>
                    <span className="font-medium">{formatPrice(totalTTC - totalHT)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                    <span>Total TTC</span>
                    <span className="text-festicup-gold">{formatPrice(totalTTC)}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-5 space-y-2.5">
                  {hasQuoteItems ? (
                    <>
                      <Button
                        onClick={() => navigate("/devis")}
                        className="w-full bg-festicup-gold hover:bg-festicup-gold/90 text-white gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Demander un devis
                      </Button>
                      <p className="text-[10px] text-center text-muted-foreground">
                        Votre panier contient des quantités nécessitant un devis personnalisé.
                      </p>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => navigate("/checkout")}
                        className="w-full bg-festicup-dark hover:bg-festicup-dark/90 text-white gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Passer commande
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/devis")}
                        className="w-full gap-2 text-sm"
                      >
                        <FileText className="w-4 h-4" />
                        Préférer un devis
                      </Button>
                    </>
                  )}
                </div>

                {/* Reassurance */}
                <div className="mt-5 pt-4 border-t border-border space-y-2.5">
                  {[
                    { icon: Package, text: "Livraison express 24-48h" },
                    { icon: ShoppingBag, text: "Paiement sécurisé (Bancontact/CB)" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Icon className="w-3.5 h-3.5 text-festicup-gold flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Panier;
