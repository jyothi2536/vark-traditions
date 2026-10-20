import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { formatPrice, photosOf } from "../shared/catalog";
import { imageUrl } from "../shared/api";

export default function Gallery() {
  const { products, galleryId, setGalleryId, addToCart } = useStore();
  const p = products.find(x => x.id === galleryId);
  const [i, setI] = useState(0);
  const touchX = useRef(null);
  const list = p ? photosOf(p) : [];
  const go = n => setI((n + list.length) % list.length);
  const close = () => setGalleryId(null);

  useEffect(() => { setI(0); }, [galleryId]);

  useEffect(() => {
    if (!p) return;
    document.body.style.overflow = "hidden";
    const onKey = e => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setI(n => (n + 1) % list.length);
      if (e.key === "ArrowLeft") setI(n => (n - 1 + list.length) % list.length);
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [p, list.length]);

  if (!p) return null;
  return (
    <div className="gallery open" onClick={e => e.target === e.currentTarget && close()}>
      <div className="g-box">
        <button className="g-close" onClick={close} aria-label="Close">✕</button>
        <div className="g-main">
          {list.length > 1 && <button className="g-nav prev" onClick={() => go(i - 1)} aria-label="Previous photo">‹</button>}
          <img
            src={imageUrl(list[i])}
            alt={p.name}
            onTouchStart={e => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={e => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
            }}
          />
          {list.length > 1 && <button className="g-nav next" onClick={() => go(i + 1)} aria-label="Next photo">›</button>}
        </div>
        {list.length > 1 && (
          <div className="g-thumbs">
            {list.map((u, k) => (
              <img key={u + k} src={imageUrl(u)} className={k === i ? "active" : ""} onClick={() => setI(k)} alt="" />
            ))}
          </div>
        )}
        <div className="g-info">
          <div>
            <h3>{p.name}</h3>
            <p className="price">{formatPrice(p.price)} {p.mrp > p.price && <del>{formatPrice(p.mrp)}</del>}</p>
          </div>
          <button className="btn btn-gold" onClick={() => addToCart(p.id)}>Add to Bag</button>
        </div>
      </div>
    </div>
  );
}
