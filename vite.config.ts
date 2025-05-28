import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path'; // Keep this import for path.resolve
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Define __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          // Keep these imports as they are, but ensure they are correctly installed
          // You might need to add them back if npm audit fix removed them
          // await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer()),
        ]
      : []),
  ],
  resolve: {
    alias: {
      // Use the explicitly defined __dirname here
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"), // Use __dirname
  build: {
    outDir: path.resolve(__dirname, "dist/public"), // Use __dirname
    emptyOutDir: true,
  },
});