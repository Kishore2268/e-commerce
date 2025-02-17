import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  
  // Resolve aliases for imports
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // Output settings for build process
  build: {
    outDir: "build", // Set build output directory to "build"
    chunkSizeWarningLimit: 500, // Adjust chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // Moves dependencies to a separate chunk
          }
        },
      },
    },
  },
  
  // Ensure proper base path for routing in production
  base: "/",  // Make sure base is set correctly, especially for sub-path hosting

  // Configure server for local development (if applicable)
  server: {
    port: 3000, // Set the port for local dev
    open: true, // Automatically open the app in the browser
  },
});
