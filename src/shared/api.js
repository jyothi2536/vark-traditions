// Talks to the VARK server. Uses only `fetch`, so it works in React and React Native.
import { API_BASE } from "./config";

// Turn "/uploads/x.jpg" into a full URL when API_BASE is set (needed in mobile apps)
export const imageUrl = src => (src && src.startsWith("/") ? API_BASE + src : src);

export async function fetchContent() {
  const res = await fetch(API_BASE + "/api/content");
  if (!res.ok) throw new Error("Could not load content");
  return res.json(); // { settings: { homeAnnouncement, topbar }, products: [...] }
}

export async function sendMessage({ name, email, phone, message, website }) {
  const res = await fetch(API_BASE + "/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, message, website }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not send");
  return data;
}
