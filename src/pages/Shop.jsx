import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useStore } from "../store";
import { SHOP_PAGES, filterProducts, titleParts } from "../shared/catalog";
import ProductCard from "../components/ProductCard";
import { Reveal } from "../components/Reveal";

export default function Shop() {
  const { section } = useParams();
  const page = SHOP_PAGES[section];
  const { products } = useStore();
  const [filter, setFilter] = useState(page?.subs[0].filter);

  useEffect(() => { if (page) setFilter(page.subs[0].filter); }, [section]);

  if (!page) return <Navigate to="/" replace />;
  const list = filterProducts(products, filter);

  return (
    <div className="page">
      <section className="hero page-hero" style={{ backgroundImage: `url("${page.img}")` }}>
        <div className="hero-overlay" />
        <div className="container hero-content">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{titleParts(page.title).map((t, k) => (t.highlight ? <em key={k}>{t.text}</em> : t.text))}</h1>
          <p>{page.desc}</p>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          {page.subs.length > 1 && (
            <div className="filters">
              {page.subs.map(s => (
                <button key={s.filter} className={s.filter === filter ? "active" : ""} onClick={() => setFilter(s.filter)}>{s.label}</button>
              ))}
            </div>
          )}
          <div className="product-grid">
            {list.length ? list.map(p => <ProductCard key={p.id} p={p} />) : <p className="empty">New styles coming soon ✨</p>}
          </div>
        </div>
      </section>

      <section className="features container">
        <Reveal><span>🧵</span><h4>Handcrafted</h4><p>Authentic weaves &amp; embroidery</p></Reveal>
        <Reveal><span>↩️</span><h4>Easy Returns</h4><p>14-day hassle-free returns</p></Reveal>
        <Reveal><span>🔒</span><h4>Secure Payment</h4><p>Cards, PayPal, Apple Pay</p></Reveal>
      </section>
    </div>
  );
}
