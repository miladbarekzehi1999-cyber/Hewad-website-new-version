import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  // Configure path aliases
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  // Dev server proxy to prevent CORS / rate-limit issues
  server: {
    proxy: {
      "/api/crypto": {
        target: "https://api.coingecko.com/api/v3",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/crypto/, ""),
      },
      "/api/fx": {
        target: "https://api.exchangerate.host",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/fx/, ""),
      },
    },
  },
});
