import { useState } from "react";
import { sendMessage } from "../shared/api";
import { CONTACT } from "../shared/config";
import { Reveal } from "../components/Reveal";

const EMPTY = { name: "", email: "", phone: "", message: "", website: "" };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ sending: false, ok: null, text: "" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ sending: true, ok: null, text: "" });
    try {
      await sendMessage(form);
      setForm(EMPTY);
      setStatus({ sending: false, ok: true, text: "Thank you! We'll get back to you soon. 🙏" });
    } catch (err) {
      const reason = err.message && err.message !== "Failed to fetch" ? err.message + ". " : "Sorry, your message couldn't be sent. ";
      setStatus({ sending: false, ok: false, text: `${reason}Please email ${CONTACT.email} or call ${CONTACT.phoneDisplay}.` });
    }
  }

  return (
    <div className="page">
      <section className="hero page-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1800')" }}>
        <div className="hero-overlay" />
        <div className="container hero-content">
          <p className="eyebrow">We're Here to Help</p>
          <h1>Contact <em>Us</em></h1>
        </div>
      </section>

      <section className="section">
        <div className="container contact">
          <Reveal>
            <p className="eyebrow">Get in Touch</p>
            <h2>We'd Love to Hear From You</h2>
            <p>📧 <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
            <p>📞 <a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a></p>
            <p>💬 <a href={CONTACT.whatsappChat} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></p>
            <p>👥 <a href={CONTACT.whatsappCommunity} target="_blank" rel="noopener noreferrer">Join our WhatsApp Community</a></p>
            <p>📸 <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">{CONTACT.instagramHandle} on Instagram</a></p>
            <p>📍 Proudly based in the USA · Shipping nationwide</p>
          </Reveal>
          <Reveal as="form" onSubmit={onSubmit}>
            <input value={form.name} onChange={set("name")} maxLength={100} placeholder="Your Name" required />
            <input type="email" value={form.email} onChange={set("email")} maxLength={150} placeholder="Your Email" required />
            <input type="tel" value={form.phone} onChange={set("phone")} maxLength={30} placeholder="Phone (optional)" />
            <textarea rows={5} value={form.message} onChange={set("message")} maxLength={3000} placeholder="Your Message" required />
            <input value={form.website} onChange={set("website")} className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button className="btn btn-gold" type="submit" disabled={status.sending}>{status.sending ? "Sending…" : "Send Message"}</button>
            <p className="form-msg" style={{ color: status.ok === false ? "#b3261e" : "green" }}>{status.text}</p>
          </Reveal>
        </div>
      </section>

      <section className="section alt" id="about">
        <div className="container about">
          <Reveal as="img" src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=900" alt="Indian traditional fabrics" />
          <Reveal>
            <p className="eyebrow">Our Story</p>
            <h2>Tradition, Woven with Love</h2>
            <p>VARK Traditions is a USA-based business born from a love for India's rich textile heritage. We bring Indian families across America carefully curated ethnic wear — from elegant men's kurtas and graceful women's outfits to glamorous cocktail sarees and adorable kids' traditional clothing.</p>
            <p>Every piece celebrates artisans, quality fabrics and designs that make you feel proud of your roots at every festival, wedding and celebration.</p>
            <div className="stats">
              <div><strong>5000+</strong><span>Happy Customers</span></div>
              <div><strong>500+</strong><span>Designs</span></div>
              <div><strong>100%</strong><span>Quality Assured</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head"><p className="eyebrow">Testimonials</p><h2>What Our Customers Say</h2></Reveal>
          <div className="testimonials">
            <Reveal as="blockquote">"The kurta fabric is so soft and the fit is perfect. Wore it to my brother's wedding and got so many compliments!"<cite>— Rahul K., Dallas, TX</cite></Reveal>
            <Reveal as="blockquote">"My cocktail saree was absolutely stunning. Beautiful drape and quick delivery."<cite>— Priya S., San Jose, CA</cite></Reveal>
            <Reveal as="blockquote">"Bought matching outfits for my kids for Diwali — they looked adorable. Great quality!"<cite>— Anjali M., Edison, NJ</cite></Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
