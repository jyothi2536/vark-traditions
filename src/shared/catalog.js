// Product categories, shop page content and helpers. Plain JS – reusable in React Native.

export const formatPrice = n => Number(n).toLocaleString("en-US", { style: "currency", currency: "USD" });

export const photosOf = p => (Array.isArray(p.images) && p.images.length ? p.images : [p.img]).filter(Boolean);

export function filterProducts(products, filter) {
  if (filter === "women-all") return products.filter(p => ["women", "sarees", "minute"].includes(p.cat));
  return products.filter(p => p.cat === filter);
}

// Content for each shop page. `title` uses *word* to mark the highlighted (gold, italic) word.
export const SHOP_PAGES = {
  women: {
    eyebrow: "Women's Collection",
    title: "Grace in Every *Drape*",
    desc: "Anarkalis, lehengas, cocktail sarees and easy 1-minute ready-to-wear sarees for every celebration.",
    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1800",
    subs: [
      { filter: "women-all", label: "All" },
      { filter: "women", label: "Traditional Wear" },
      { filter: "sarees", label: "Cocktail Sarees" },
      { filter: "minute", label: "1-Minute Sarees" },
    ],
  },
  men: {
    eyebrow: "Men's Collection",
    title: "Kurtas with *Character*",
    desc: "Silk, cotton and chikankari kurtas — crafted for festivals, weddings and everyday elegance.",
    img: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=1800",
    subs: [{ filter: "men", label: "All Kurtas" }],
  },
  kids: {
    eyebrow: "Kids' Collection",
    title: "Little Ones, Big *Traditions*",
    desc: "Adorable, comfortable traditional outfits for boys and girls.",
    img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1800",
    subs: [{ filter: "kids", label: "All Kids" }],
  },
};

// Split "Grace in Every *Drape*" into parts so any UI (web or mobile) can style the highlight
export const titleParts = title =>
  title.split(/(\*[^*]+\*)/).filter(Boolean).map(t => (t.startsWith("*") ? { text: t.slice(1, -1), highlight: true } : { text: t, highlight: false }));

// Shown if the server can't be reached
export const FALLBACK_CONTENT = {
  settings: { homeAnnouncement: "🪔 Diwali Collection Now Live 🪔", topbar: "✨ Festive Collection now live ✨" },
  products: [
    { id: 1, name: "Royal Silk Kurta Set", cat: "men", price: 89, mrp: 119, tag: "Bestseller", img: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600" },
    { id: 2, name: "Cotton Chikankari Kurta", cat: "men", price: 59, mrp: 79, img: "https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?w=600" },
    { id: 3, name: "Embroidered Anarkali Suit", cat: "women", price: 129, mrp: 169, tag: "New", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600" },
    { id: 4, name: "Festive Lehenga Choli", cat: "women", price: 229, mrp: 299, img: "https://images.unsplash.com/photo-1583391733981-8498408ee0a8?w=600" },
    { id: 5, name: "Sequin Cocktail Saree", cat: "sarees", price: 169, mrp: 219, tag: "Trending", img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600" },
    { id: 6, name: "Georgette Party Saree", cat: "sarees", price: 139, mrp: 189, img: "https://images.unsplash.com/photo-1610189025857-f4d9b1b9a4b5?w=600" },
    { id: 9, name: "Ready-to-Wear Silk Saree", cat: "minute", price: 119, mrp: 159, tag: "1-Min Drape", img: "https://images.unsplash.com/photo-1583391733981-8498408ee0a8?w=600" },
    { id: 10, name: "Pre-Stitched Georgette Saree", cat: "minute", price: 99, mrp: 139, tag: "1-Min Drape", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600" },
    { id: 11, name: "Pre-Pleated Party Saree", cat: "minute", price: 129, mrp: 179, tag: "New", img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600" },
    { id: 7, name: "Kids Kurta Pajama Set", cat: "kids", price: 39, mrp: 55, tag: "New", img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600" },
    { id: 8, name: "Girls Pattu Pavadai", cat: "kids", price: 49, mrp: 69, img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600" },
  ],
};
