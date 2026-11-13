import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 5174,
    strictPort: true,
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/@mui")) return "mui";
          if (id.includes("node_modules/leaflet")) return "leaflet";
          if (/node_modules[/\\](react|react-dom)[/\\]/.test(id)) {
            return "react-vendor";
          }
          return undefined;
        },
      },
    },
  },
  preview: {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },
});
