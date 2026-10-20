import { useState } from "react";
import { Link } from "react-router-dom";
import { CONTACT } from "../shared/config";

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <img src="/images/logo.png" alt="VARK Traditions logo" className="footer-logo" />
          <p>Timeless Indian traditional clothing for the whole family — a USA-owned business.</p>
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
          <a href="#">Shipping Policy</a><a href="#">Returns</a><a href="#">Size Guide</a>
        </div>
        <div>
          <h4>Newsletter</h4>
          {subscribed ? <p>Thank you for subscribing! 🙏</p> : (
            <form className="newsletter" onSubmit={e => { e.preventDefault(); setSubscribed(true); }}>
              <input type="email" placeholder="Your email" required /><button>Join</button>
            </form>
          )}
        </div>
      </div>
      <p className="copy">© {new Date().getFullYear()} VARK Traditions · varktraditions.com</p>
    </footer>
  );
}
