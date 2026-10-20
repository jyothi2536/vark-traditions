import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During development (npm run dev), API calls and uploaded photos
// are forwarded to the Node server running on port 3000.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
      "/uploads": "http://localhost:3000",
    },
  },
});
