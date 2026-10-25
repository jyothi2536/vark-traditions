import { Link } from "react-router-dom";
import { CONTACT } from "../shared/config";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <img src="/images/logo.png" alt="VARK Traditions logo" className="footer-logo" />
          <p>Timeless Indian traditional clothing for the whole family.</p>
          <p>📍 {CONTACT.address}</p>
          <p>Visits by appointment — message us on WhatsApp.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/women">Women</Link><Link to="/men">Men</Link><Link to="/kids">Kids</Link>
        </div>
        <div>
          <h4>Help</h4>
          <Link to="/contact">Contact Us</Link>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={CONTACT.whatsappCommunity} target="_blank" rel="noopener noreferrer">WhatsApp Community</a>
          <a href={CONTACT.whatsappChat} target="_blank" rel="noopener noreferrer">Shipping — ask on WhatsApp</a>
        </div>
      </div>
      <p className="copy">© {new Date().getFullYear()} VARK Traditions · varktraditions.com</p>
    </footer>
  );
}
