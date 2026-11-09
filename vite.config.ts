import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Permite importar com "@/shared/..." em vez de "../../../shared/..."
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
})
