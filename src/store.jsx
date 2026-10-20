import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { fetchContent } from "./shared/api";
import { FALLBACK_CONTENT } from "./shared/catalog";
import { addItem, removeItem, cartLines, cartCount, cartTotal } from "./shared/cart";

const StoreContext = createContext(null);
const CART_KEY = "varkCart";

export function StoreProvider({ children }) {
  const [content, setContent] = useState(FALLBACK_CONTENT);
  const [loaded, setLoaded] = useState(false);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [galleryId, setGalleryId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef();

  // Load live products + announcements from the admin-managed server
  useEffect(() => {
    fetchContent()
      .then(data => { setContent({ settings: data.settings || {}, products: data.products || [] }); setLoaded(true); })
      .catch(() => console.warn("Admin server not reachable – showing built-in sample products."));
  }, []);

  // Once live products are loaded, drop bag items the admin has deleted
  useEffect(() => {
    if (loaded) setCart(c => c.filter(i => content.products.some(p => p.id === i.id)));
  }, [loaded, content.products]);

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);

  const toast = useCallback(msg => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 1800);
  }, []);

  const lines = useMemo(() => cartLines(cart, content.products), [cart, content.products]);

  const value = {
    settings: content.settings,
    products: content.products,
    lines,
    count: cartCount(lines),
    total: cartTotal(lines),
    addToCart: id => { setCart(c => addItem(c, id)); toast("Added to bag 🛍"); },
    removeFromCart: id => setCart(c => removeItem(c, id)),
    cartOpen, setCartOpen,
    galleryId, setGalleryId,
    toastMsg,
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
