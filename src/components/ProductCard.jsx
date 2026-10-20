import { useStore } from "../store";
import { formatPrice, photosOf } from "../shared/catalog";
import { imageUrl } from "../shared/api";

export default function ProductCard({ p }) {
  const { addToCart, setGalleryId } = useStore();
  const count = photosOf(p).length;
  return (
    <div className="product">
      <div
        className="img"
        style={{ backgroundImage: `url("${encodeURI(imageUrl(p.img))}")` }}
        onClick={() => setGalleryId(p.id)}
        title="View photos"
        role="button"
      >
        {p.tag && <span className="tag">{p.tag}</span>}
        {count > 1 && <span className="count">📷 {count}</span>}
      </div>
      <div className="info">
        <h4>{p.name}</h4>
        <p className="price">{formatPrice(p.price)} {p.mrp > p.price && <del>{formatPrice(p.mrp)}</del>}</p>
        <button onClick={() => addToCart(p.id)}>Add to Bag</button>
      </div>
    </div>
  );
}
