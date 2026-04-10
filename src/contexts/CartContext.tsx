import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type Product, getPriceForQty, isAboveQuoteThreshold, TVA_RATE } from "@/data/products";

export interface CartItem {
  product: Product;
  qty: number;
  mode: "achat" | "location";
  color: string;
  customText: string;
  withLogo: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalHT: number;
  totalTTC: number;
  itemCount: number;
  hasQuoteItems: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === newItem.product.id && i.mode === newItem.mode);
      if (existing) {
        return prev.map((i) =>
          i.product.id === newItem.product.id && i.mode === newItem.mode
            ? { ...i, qty: i.qty + newItem.qty, color: newItem.color, customText: newItem.customText, withLogo: newItem.withLogo }
            : i
        );
      }
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.product.id === productId ? { ...i, qty } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalHT = items.reduce((sum, item) => {
    if (item.mode === "location") {
      return sum + (item.product.locationPriceHT || 0) * item.qty;
    }
    return sum + getPriceForQty(item.product, item.qty) * item.qty;
  }, 0);

  const totalTTC = totalHT * (1 + TVA_RATE);
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const hasQuoteItems = items.some((i) => isAboveQuoteThreshold(i.qty));

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totalHT, totalTTC, itemCount, hasQuoteItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
