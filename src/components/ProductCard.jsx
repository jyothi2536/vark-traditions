import { useStore } from "../store";
import { formatPrice, photosOf } from "../shared/catalog";
import { imageUrl } from "../shared/api";
import { CONTACT } from "../shared/config";

export default function ProductCard({ p }) {
  const { setGalleryId } = useStore();
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
        <a
          className="enquire"
          href={`${CONTACT.whatsappChat}?text=${encodeURIComponent(`Hi, I'm interested in "${p.name}". Is it available?`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >Enquire on WhatsApp</a>
      </div>
    </div>
  );
}
