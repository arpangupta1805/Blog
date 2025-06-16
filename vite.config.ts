import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "import.meta.env.VITE_MONGODB_URI": JSON.stringify(env.MONGODB_URI),
      "import.meta.env.VITE_ADMIN_PASSWORD": JSON.stringify(env.ADMIN_PASSWORD),
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
    },
  };
});
