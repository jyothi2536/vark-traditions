import { useStore } from "../store";
import { formatPrice } from "../shared/catalog";
import { imageUrl } from "../shared/api";

export default function CartPanel() {
  const { lines, total, removeFromCart, cartOpen, setCartOpen } = useStore();
  return (
    <div className={`cart-panel ${cartOpen ? "open" : ""}`}>
      <div className="cart-head"><h3>Your Bag</h3><button onClick={() => setCartOpen(false)} aria-label="Close bag">✕</button></div>
      <div className="cart-items">
        {lines.length ? lines.map(({ product: p, qty }) => (
          <div className="cart-item" key={p.id}>
            <img src={imageUrl(p.img)} alt="" />
            <div>{p.name}<br /><small>{qty} × {formatPrice(p.price)}</small></div>
            <button onClick={() => removeFromCart(p.id)} aria-label={`Remove ${p.name}`}>✕</button>
          </div>
        )) : <p>Your bag is empty.</p>}
      </div>
      <div className="cart-foot">
        <p>Total: <strong>{formatPrice(total)}</strong></p>
        <button className="btn btn-gold" onClick={() => alert("Checkout coming soon! Contact us on WhatsApp to order.")}>Checkout</button>
      </div>
    </div>
  );
}
