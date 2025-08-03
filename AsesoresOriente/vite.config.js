import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000'
    },
    host: true, // Permite que el servidor escuche en todas las interfaces
       allowedHosts: [
         '06c64c8757d814.lhr.life', // Agrega el dominio que estás usando
       ],
  },
})
