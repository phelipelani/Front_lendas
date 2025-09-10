import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Configuração do proxy para a API
    proxy: {
      "/api": {
        // Altere 'localhost' para '127.0.0.1' para forçar a conexão IPv4
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
