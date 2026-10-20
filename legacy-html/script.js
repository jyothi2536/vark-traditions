// Products and announcement text are managed in the Admin portal (/admin.html).
// This list is only a fallback if the server can't be reached.
let products = [
  { id: 1, name: "Royal Silk Kurta Set", cat: "men", price: 89, mrp: 119, tag: "Bestseller", img: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600" },
  { id: 2, name: "Cotton Chikankari Kurta", cat: "men", price: 59, mrp: 79, img: "https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?w=600" },
  { id: 3, name: "Embroidered Anarkali Suit", cat: "women", price: 129, mrp: 169, tag: "New", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600" },
  { id: 4, name: "Festive Lehenga Choli", cat: "women", price: 229, mrp: 299, img: "https://images.unsplash.com/photo-1583391733981-8498408ee0a8?w=600" },
  { id: 5, name: "Sequin Cocktail Saree", cat: "sarees", price: 169, mrp: 219, tag: "Trending", img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600" },
  { id: 6, name: "Georgette Party Saree", cat: "sarees", price: 139, mrp: 189, img: "https://images.unsplash.com/photo-1610189025857-f4d9b1b9a4b5?w=600" },
  // 1-Minute (ready-to-wear, pre-stitched) sarees
  { id: 9, name: "Ready-to-Wear Silk Saree", cat: "minute", price: 119, mrp: 159, tag: "1-Min Drape", img: "https://images.unsplash.com/photo-1583391733981-8498408ee0a8?w=600" },
  { id: 10, name: "Pre-Stitched Georgette Saree", cat: "minute", price: 99, mrp: 139, tag: "1-Min Drape", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600" },
  { id: 11, name: "Pre-Pleated Party Saree", cat: "minute", price: 129, mrp: 179, tag: "New", img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600" },
  { id: 7, name: "Kids Kurta Pajama Set", cat: "kids", price: 39, mrp: 55, tag: "New", img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600" },
  { id: 8, name: "Girls Pattu Pavadai", cat: "kids", price: 49, mrp: 69, img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600" },
];

const fmt = n => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const grid = document.getElementById("productGrid");
let cart = JSON.parse(localStorage.getItem("varkCart") || "[]");
let currentFilter = null;
const photosOf = p => (Array.isArray(p.images) && p.images.length ? p.images : [p.img]).filter(Boolean);

// ---- Photo gallery (all photos of one product) ----
let gal = { p: null, i: 0 };
function openGallery(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  gal = { p, i: 0 };
  document.getElementById("gName").textContent = p.name;
  document.getElementById("gPrice").innerHTML = `${fmt(p.price)} ${p.mrp > p.price ? `<del>${fmt(p.mrp)}</del>` : ""}`;
  document.getElementById("gAdd").onclick = () => addToCart(p.id);
  showPhoto(0);
  document.getElementById("gallery").classList.add("open");
  document.body.style.overflow = "hidden";
}
function showPhoto(i) {
  const list = photosOf(gal.p);
  gal.i = (i + list.length) % list.length;
  document.getElementById("gImg").src = list[gal.i];
  document.getElementById("gThumbs").innerHTML = list.length > 1 ? list.map((u, k) =>
    `<img src="${esc(u)}" class="${k === gal.i ? "active" : ""}" onclick="showPhoto(${k})" alt="" />`).join("") : "";
  document.querySelectorAll(".g-nav").forEach(b => (b.hidden = list.length < 2));
}
function closeGallery() {
  document.getElementById("gallery").classList.remove("open");
  document.body.style.overflow = "";
}
document.addEventListener("keydown", e => {
  if (!document.getElementById("gallery").classList.contains("open")) return;
  if (e.key === "Escape") closeGallery();
  if (e.key === "ArrowRight") showPhoto(gal.i + 1);
  if (e.key === "ArrowLeft") showPhoto(gal.i - 1);
});
// swipe on phones
let touchX = null;
document.addEventListener("touchstart", e => { if (e.target.id === "gImg") touchX = e.touches[0].clientX; });
document.addEventListener("touchend", e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX; touchX = null;
  if (Math.abs(dx) > 40) showPhoto(gal.i + (dx < 0 ? 1 : -1));
});

function render(filter) {
  currentFilter = filter;
  const list = products.filter(p => filter === "women-all" ? ["women", "sarees", "minute"].includes(p.cat) : p.cat === filter);
  grid.innerHTML = list.length ? list
    .map(p => `
      <div class="product">
        <div class="img" style="background-image:url('${esc(encodeURI(p.img))}')" onclick="openGallery(${Number(p.id)})" title="View photos">${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ""}${photosOf(p).length > 1 ? `<span class="count">📷 ${photosOf(p).length}</span>` : ""}</div>
        <div class="info">
          <h4>${esc(p.name)}</h4>
          <p class="price">${fmt(p.price)} ${p.mrp > p.price ? `<del>${fmt(p.mrp)}</del>` : ""}</p>
          <button onclick="addToCart(${Number(p.id)})">Add to Bag</button>
        </div>
      </div>`).join("") : `<p class="empty">New styles coming soon ✨</p>`;
}

// Content for each shop page (edit text/images here)
const shopPages = {
  women: {
    eyebrow: "Women's Collection",
    title: "Grace in Every <em>Drape</em>",
    desc: "Anarkalis, lehengas, cocktail sarees and easy 1-minute ready-to-wear sarees for every celebration.",
    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1800",
    subs: [["women-all", "All"], ["women", "Traditional Wear"], ["sarees", "Cocktail Sarees"], ["minute", "1-Minute Sarees"]],
  },
  men: {
    eyebrow: "Men's Collection",
    title: "Kurtas with <em>Character</em>",
    desc: "Silk, cotton and chikankari kurtas — crafted for festivals, weddings and everyday elegance.",
    img: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=1800",
    subs: [["men", "All Kurtas"]],
  },
  kids: {
    eyebrow: "Kids' Collection",
    title: "Little Ones, Big <em>Traditions</em>",
    desc: "Adorable, comfortable traditional outfits for boys and girls.",
    img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1800",
    subs: [["kids", "All Kids"]],
  },
};

function setFilter(f) {
  document.querySelectorAll("#filters button").forEach(b => b.classList.toggle("active", b.dataset.filter === f));
  render(f);
}

function showShop(key) {
  const s = shopPages[key];
  document.getElementById("shopHero").style.backgroundImage = `url('${s.img}')`;
  document.getElementById("shopEyebrow").textContent = s.eyebrow;
  document.getElementById("shopTitle").innerHTML = s.title;
  document.getElementById("shopDesc").textContent = s.desc;
  const filters = document.getElementById("filters");
  filters.innerHTML = s.subs.length > 1 ? s.subs.map(([f, label]) => `<button data-filter="${f}">${label}</button>`).join("") : "";
  filters.querySelectorAll("button").forEach(b => b.onclick = () => setFilter(b.dataset.filter));
  setFilter(s.subs[0][0]);
}

// Simple page router: #home, #women, #men, #kids, #contact
function route() {
  const r = location.hash.slice(1) || "home";
  const page = shopPages[r] ? "shop" : r === "contact" ? "contact" : "home";
  document.querySelectorAll(".page").forEach(p => (p.hidden = p.id !== "page-" + page));
  document.body.classList.toggle("on-home", page === "home");
  document.querySelectorAll("#menu a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + (page === "home" ? "home" : r)));
  if (page === "shop") showShop(r);
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);

// Floating gold particles on the home page
const particles = document.getElementById("particles");
for (let i = 0; i < 28; i++) {
  const s = document.createElement("span");
  s.style.left = Math.random() * 100 + "%";
  s.style.animationDelay = Math.random() * 8 + "s";
  s.style.animationDuration = 6 + Math.random() * 6 + "s";
  s.style.width = s.style.height = 2 + Math.random() * 4 + "px";
  particles.appendChild(s);
}

let contentLoaded = false;
function saveCart() {
  // Only drop removed items once the live product list has loaded
  if (contentLoaded) cart = cart.filter(i => products.some(x => x.id === i.id));
  localStorage.setItem("varkCart", JSON.stringify(cart));
  const shown = cart.filter(i => products.some(x => x.id === i.id));
  document.getElementById("cartCount").textContent = shown.reduce((s, i) => s + i.qty, 0);
  document.getElementById("cartItems").innerHTML = shown.length ? shown.map(i => {
    const p = products.find(x => x.id === i.id);
    return `<div class="cart-item"><img src="${esc(p.img)}" alt=""><div>${esc(p.name)}<br><small>${i.qty} × ${fmt(p.price)}</small></div><button onclick="removeFromCart(${Number(p.id)})">✕</button></div>`;
  }).join("") : "<p>Your bag is empty.</p>";
  document.getElementById("cartTotal").textContent = fmt(shown.reduce((s, i) => s + i.qty * products.find(x => x.id === i.id).price, 0));
}
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  item ? item.qty++ : cart.push({ id, qty: 1 });
  saveCart();
  toast("Added to bag 🛍");
}
function removeFromCart(id) { cart = cart.filter(i => i.id !== id); saveCart(); }

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

const panel = document.getElementById("cartPanel");
document.getElementById("cartBtn").onclick = () => panel.classList.add("open");
document.getElementById("closeCart").onclick = () => panel.classList.remove("open");
document.getElementById("menuToggle").onclick = () => document.getElementById("menu").classList.toggle("open");
document.querySelectorAll("#menu a").forEach(a => a.onclick = () => document.getElementById("menu").classList.remove("open"));

document.getElementById("contactForm").onsubmit = async e => {
  e.preventDefault();
  const form = e.target, msg = document.getElementById("formMsg"), btn = form.querySelector("button");
  btn.disabled = true; btn.textContent = "Sending…";
  try {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Could not send");
    msg.style.color = "green";
    msg.textContent = "Thank you! We'll get back to you soon. 🙏";
    form.reset();
  } catch (err) {
    msg.style.color = "#b3261e";
    msg.textContent = (err.message && err.message !== "Failed to fetch" ? err.message + ". " : "Sorry, your message couldn't be sent. ") + "Please email varktraditions@gmail.com or call +1 (404) 971-3550.";
  }
  btn.disabled = false; btn.textContent = "Send Message";
};
document.getElementById("year").textContent = new Date().getFullYear();

route();
saveCart();

// Load the latest products + announcement text from the admin-managed server
fetch("/api/content")
  .then(r => (r.ok ? r.json() : Promise.reject()))
  .then(data => {
    if (Array.isArray(data.products)) { products = data.products; contentLoaded = true; }
    const s = data.settings || {};
    const festive = document.querySelector(".festive");
    const topbar = document.querySelector(".topbar");
    if (festive) { festive.textContent = s.homeAnnouncement || ""; festive.hidden = !s.homeAnnouncement; }
    if (topbar) { topbar.textContent = s.topbar || ""; topbar.hidden = !s.topbar; }
    if (currentFilter) render(currentFilter);
    saveCart();
  })
  .catch(() => console.warn("Admin server not reachable – showing built-in sample products."));

// Fade sections in as they scroll into view
const revealEls = document.querySelectorAll(".section-head, .cat, .about > *, .testimonials blockquote, .contact > *, .banner .container, .features > div");
revealEls.forEach(el => el.classList.add("reveal"));
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));
