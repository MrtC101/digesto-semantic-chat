import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "API_URL");
  return {
    server: {
      host: "::",
      port: 8082,
      proxy: {
        "/api": {
          target: env.API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) =>
            path.replace(/^\/api/, "/normita/api/v1"),
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            motion: ["framer-motion"],
            radix: [
              "@radix-ui/react-dialog",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-toast",
            ],
            lucide: ["lucide-react"],
          },
        },
      },
      //chunkSizeWarningLimit: 1000, // opcional, solo para silenciar el warning
    },
  };
});
