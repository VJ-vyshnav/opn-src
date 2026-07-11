import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Static build — outputs to /dist, deployable to Vercel/Netlify/GitHub Pages
export default defineConfig({
  plugins: [react()],
});
