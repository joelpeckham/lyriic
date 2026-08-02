import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/** Separate build for the OG gallery (screenshot target). Not shipped in the app. */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    outDir: "dist-og",
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        og: path.resolve(import.meta.dirname, "og.html"),
      },
    },
  },
});
