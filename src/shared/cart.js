// Shopping bag logic as pure functions – reusable in React Native.
// A cart is an array of { id, qty }. Saving is done by the platform
// (localStorage on the web, AsyncStorage in React Native).

export const addItem = (cart, id) =>
  cart.some(i => i.id === id) ? cart.map(i => (i.id === id ? { ...i, qty: i.qty + 1 } : i)) : [...cart, { id, qty: 1 }];

export const removeItem = (cart, id) => cart.filter(i => i.id !== id);

// Join cart items with their product details, skipping products that no longer exist
export const cartLines = (cart, products) =>
  cart.map(i => ({ ...i, product: products.find(p => p.id === i.id) })).filter(l => l.product);

export const cartCount = lines => lines.reduce((s, l) => s + l.qty, 0);
export const cartTotal = lines => lines.reduce((s, l) => s + l.qty * l.product.price, 0);
