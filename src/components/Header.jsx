import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../store";

const MENU = [
  { to: "/", label: "Home" },
  { to: "/women", label: "Women" },
  { to: "/men", label: "Men" },
  { to: "/kids", label: "Kids" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { count, setCartOpen } = useStore();
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="container nav">
        <Link to="/" className="logo">
          <img src="/images/logo.png" alt="VARK Traditions logo" className="logo-img" />VARK <span>Traditions</span>
        </Link>
        <nav className={open ? "open" : ""}>
          {MENU.map(m => (
            <NavLink key={m.to} to={m.to} end={m.to === "/"} onClick={() => setOpen(false)}>{m.label}</NavLink>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Open bag">🛍 <span>{count}</span></button>
          <button className="menu-toggle" onClick={() => setOpen(o => !o)} aria-label="Menu">☰</button>
        </div>
      </div>
    </header>
  );
}
