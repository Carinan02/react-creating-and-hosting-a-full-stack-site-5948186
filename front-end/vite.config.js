import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://jubilant-spoon-7v9p6jjj6vjvcxxjj-8000.app.github.dev",
        changeOrigin: true,
      },
    },
  },
});
