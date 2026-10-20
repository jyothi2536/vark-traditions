import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useStore } from "./store";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartPanel from "./components/CartPanel";
import Gallery from "./components/Gallery";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";

export default function App() {
  const { settings, toastMsg } = useStore();
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <>
      {!onHome && settings.topbar && <div className="topbar">{settings.topbar}</div>}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/:section" element={<Shop />} />
      </Routes>
      {!onHome && <Footer />}
      <CartPanel />
      <Gallery />
      <div className={`toast ${toastMsg ? "show" : ""}`}>{toastMsg}</div>
    </>
  );
}
