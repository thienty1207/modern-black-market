import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // proxy: { // Tạm thời vô hiệu hóa proxy
    //   // Proxy API requests to backend server
    //   '/api': {
    //     target: 'http://localhost:8000', // URL của backend FastAPI
    //     changeOrigin: true, // Cần thiết cho virtual hosted sites
    //     secure: false,      // Nếu backend chạy trên http
    //   }
    // }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
