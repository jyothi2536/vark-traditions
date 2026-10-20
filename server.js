// VARK Traditions – website + admin server
// Run:  npm run build  then  ADMIN_PASSWORD=yourpassword npm start   → http://localhost:3000  (admin: /admin.html)
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "content.json");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const CATEGORIES = ["women", "sarees", "minute", "men", "kids"];

if (ADMIN_PASSWORD === "changeme") console.warn("⚠️  Using default admin password 'changeme'. Set ADMIN_PASSWORD before going live.");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
// First run with a custom DATA_DIR: start from the bundled sample content
if (!fs.existsSync(DATA_FILE)) fs.copyFileSync(path.join(__dirname, "data", "content.json"), DATA_FILE);

// ---------- data helpers ----------
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}
function writeData(data) {
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DATA_FILE); // atomic replace
}
function removeUpload(img) {
  if (img && img.startsWith("/uploads/")) {
    fs.rm(path.join(UPLOAD_DIR, path.basename(img)), { force: true }, () => {});
  }
}
const clean = (v, max = 200) => String(v ?? "").trim().slice(0, max);
function productFields(body) {
  const price = Number(body.price), mrp = Number(body.mrp);
  if (!clean(body.name)) throw new Error("Product name is required");
  if (!CATEGORIES.includes(body.cat)) throw new Error("Invalid category");
  if (!(price > 0)) throw new Error("Price must be greater than 0");
  return {
    name: clean(body.name, 120),
    cat: body.cat,
    price,
    mrp: mrp > 0 ? mrp : null,
    tag: clean(body.tag, 30),
  };
}

// ---------- auth (simple token, kept in memory) ----------
const sessions = new Map(); // token -> expiry
const SESSION_MS = 8 * 60 * 60 * 1000;
function safeEqual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer /, "");
  const exp = sessions.get(token);
  if (!exp || exp < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ error: "Please log in again" });
  }
  next();
}
const loginAttempts = new Map(); // ip -> {count, until}

// ---------- uploads ----------
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
      const ext = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif" }[file.mimetype];
      cb(null, crypto.randomUUID() + ext);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPG, PNG, WEBP or GIF images are allowed")),
});

// ---------- app ----------
const app = express();
// Behind a host's proxy (Render etc.), use the visitor's real IP for rate limits
app.set("trust proxy", 1);
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d" }));

// Public: everything the website needs
app.get("/api/content", (req, res) => res.json(readData()));

app.post("/api/login", (req, res) => {
  const ip = req.ip;
  const a = loginAttempts.get(ip) || { count: 0, until: 0 };
  if (a.until > Date.now()) return res.status(429).json({ error: "Too many attempts. Try again in a few minutes." });
  if (!safeEqual(req.body.password || "", ADMIN_PASSWORD)) {
    a.count++;
    if (a.count >= 5) { a.until = Date.now() + 10 * 60 * 1000; a.count = 0; }
    loginAttempts.set(ip, a);
    return res.status(401).json({ error: "Wrong password" });
  }
  loginAttempts.delete(ip);
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + SESSION_MS);
  res.json({ token });
});

app.post("/api/logout", requireAdmin, (req, res) => {
  sessions.delete((req.headers.authorization || "").replace(/^Bearer /, ""));
  res.json({ ok: true });
});

// Announcement texts
app.put("/api/settings", requireAdmin, (req, res) => {
  const data = readData();
  data.settings = {
    homeAnnouncement: clean(req.body.homeAnnouncement, 120),
    topbar: clean(req.body.topbar, 160),
  };
  writeData(data);
  res.json(data.settings);
});

// Products
const MAX_PHOTOS = 10;
const imagesOf = p => (Array.isArray(p.images) && p.images.length ? p.images : p.img ? [p.img] : []);
const removeFiles = files => (files || []).forEach(f => removeUpload("/uploads/" + f.filename));

// Build the final photo list from the admin's chosen order:
// tokens like "old:/uploads/x.jpg" (keep existing) and "new:0" (the 1st newly uploaded file)
function buildImages(current, files, orderRaw) {
  let order;
  try { order = JSON.parse(orderRaw || "null"); } catch { order = null; }
  if (!Array.isArray(order)) order = [...current.map(u => "old:" + u), ...files.map((_, i) => "new:" + i)];
  const out = [];
  for (const t of order.map(String)) {
    if (t.startsWith("old:")) { const u = t.slice(4); if (current.includes(u) && !out.includes(u)) out.push(u); }
    else if (t.startsWith("new:")) { const f = files[Number(t.slice(4))]; const u = f && "/uploads/" + f.filename; if (u && !out.includes(u)) out.push(u); }
  }
  if (!out.length) throw new Error("Please add at least one photo");
  if (out.length > MAX_PHOTOS) throw new Error(`Maximum ${MAX_PHOTOS} photos per product`);
  return out;
}

app.post("/api/products", requireAdmin, upload.array("images", MAX_PHOTOS), (req, res) => {
  const files = req.files || [];
  try {
    const fields = productFields(req.body);
    const images = buildImages([], files, req.body.order);
    files.forEach(f => { if (!images.includes("/uploads/" + f.filename)) removeUpload("/uploads/" + f.filename); });
    const data = readData();
    const id = Math.max(0, ...data.products.map(p => p.id)) + 1;
    const product = { id, ...fields, images, img: images[0] };
    data.products.unshift(product); // newest first
    writeData(data);
    res.json(product);
  } catch (e) {
    removeFiles(files);
    res.status(400).json({ error: e.message });
  }
});

app.put("/api/products/:id", requireAdmin, upload.array("images", MAX_PHOTOS), (req, res) => {
  const files = req.files || [];
  try {
    const data = readData();
    const p = data.products.find(x => x.id === Number(req.params.id));
    if (!p) throw new Error("Product not found");
    const fields = productFields(req.body);
    const old = imagesOf(p);
    const images = buildImages(old, files, req.body.order);
    Object.assign(p, fields, { images, img: images[0] });
    writeData(data);
    // clean up photos no longer used
    old.filter(u => !images.includes(u)).forEach(removeUpload);
    files.forEach(f => { if (!images.includes("/uploads/" + f.filename)) removeUpload("/uploads/" + f.filename); });
    res.json(p);
  } catch (e) {
    removeFiles(files);
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/products/:id", requireAdmin, (req, res) => {
  const data = readData();
  const p = data.products.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: "Product not found" });
  data.products = data.products.filter(x => x !== p);
  writeData(data);
  imagesOf(p).forEach(removeUpload);
  res.json({ ok: true });
});

// ---------- Contact messages (stored privately, never in /api/content) ----------
const MSG_FILE = path.join(DATA_DIR, "messages.json");
const readMessages = () => (fs.existsSync(MSG_FILE) ? JSON.parse(fs.readFileSync(MSG_FILE, "utf8")) : []);
function writeMessages(list) {
  fs.writeFileSync(MSG_FILE + ".tmp", JSON.stringify(list, null, 2));
  fs.renameSync(MSG_FILE + ".tmp", MSG_FILE);
}
const msgLimits = new Map(); // ip -> [timestamps]

// Public: website contact form
app.post("/api/messages", (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // hidden spam-trap field filled → silently ignore
  const now = Date.now();
  const recent = (msgLimits.get(req.ip) || []).filter(t => now - t < 60 * 60 * 1000);
  if (recent.length >= 5) return res.status(429).json({ error: "Too many messages sent. Please try again later" });

  const name = clean(b.name, 100), email = clean(b.email, 150), phone = clean(b.phone, 30), message = clean(b.message, 3000);
  if (!name || !message) return res.status(400).json({ error: "Please enter your name and message" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Please enter a valid email" });

  const list = readMessages();
  list.unshift({ id: crypto.randomUUID(), name, email, phone, message, date: new Date().toISOString(), read: false });
  writeMessages(list.slice(0, 2000)); // keep the latest 2000
  recent.push(now); msgLimits.set(req.ip, recent);
  res.json({ ok: true });
});

// Admin: list, mark read, delete
app.get("/api/messages", requireAdmin, (req, res) => res.json(readMessages()));

app.patch("/api/messages/:id", requireAdmin, (req, res) => {
  const list = readMessages();
  const m = list.find(x => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: "Message not found" });
  m.read = !!req.body.read;
  writeMessages(list);
  res.json(m);
});

app.delete("/api/messages/:id", requireAdmin, (req, res) => {
  const list = readMessages();
  const next = list.filter(x => x.id !== req.params.id);
  if (next.length === list.length) return res.status(404).json({ error: "Message not found" });
  writeMessages(next);
  res.json({ ok: true });
});

// Website files: the built React app in /dist (run `npm run build` first)
const DIST = path.join(__dirname, "dist");
if (!fs.existsSync(path.join(DIST, "index.html"))) console.warn("⚠️  No dist/ folder found. Run `npm run build` to build the website.");
app.use(express.static(DIST, { index: false }));
// Any other page (e.g. /women, /contact) → React app handles the route
app.get(/^\/(?!api\/|uploads\/).*/, (req, res) => res.sendFile(path.join(DIST, "index.html")));

app.use((err, req, res, next) => {
  removeFiles(req.files); // don't leave half-uploaded photos behind
  const msg = err.code === "LIMIT_UNEXPECTED_FILE" ? `Maximum ${MAX_PHOTOS} photos per product`
    : err.code === "LIMIT_FILE_SIZE" ? "Each photo must be under 8 MB"
    : err.message || "Something went wrong";
  res.status(400).json({ error: msg });
});

app.listen(PORT, () => console.log(`VARK Traditions running at http://localhost:${PORT}  (admin: /admin.html)`));
