import { defineConfig } from "vite"
import uni from "@dcloudio/vite-plugin-uni"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  define: {
    "process.env": {
      VITE_APP_API_URL: process.env.VITE_APP_API_URL,
    },
  },
})
