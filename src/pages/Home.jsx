import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store";
import { CONTACT } from "../shared/config";
import { InstagramIcon, WhatsAppIcon } from "../components/Icons";

export default function Home() {
  const { settings } = useStore();
  // Floating gold particles (random positions created once)
  const particles = useMemo(() => Array.from({ length: 28 }, () => {
    const size = 2 + Math.random() * 4 + "px";
    return { left: Math.random() * 100 + "%", animationDelay: Math.random() * 8 + "s", animationDuration: 6 + Math.random() * 6 + "s", width: size, height: size };
  }), []);

  return (
    <main className="page home-stage">
      <div className="particles">{particles.map((s, k) => <span key={k} style={s} />)}</div>
      <div className="logo-wrap">
        <div className="ring r1" />
        <div className="ring r2" />
        <div className="pl-logo"><img src="/images/logo.png" alt="VARK Traditions" /><span className="shine" /></div>
      </div>
      <p className="pl-text">Rooted in Heritage · Crafted for Today</p>
      {settings.homeAnnouncement && <p className="festive">{settings.homeAnnouncement}</p>}
      <div className="home-links">
        <Link to="/women">Women</Link><span>✦</span><Link to="/men">Men</Link><span>✦</span><Link to="/kids">Kids</Link>
      </div>
      <Link to="/women" className="btn btn-gold home-cta">Shop Now</Link>
      <div className="social">
        <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
        <a href={CONTACT.whatsappCommunity} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp community"><WhatsAppIcon /></a>
      </div>
    </main>
  );
}
