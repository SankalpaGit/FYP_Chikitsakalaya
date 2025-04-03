import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: {},
  },
  optimizeDeps: {
    include: ["simple-peer", "socket.io-client"],
  },
  plugins: [react()],
  build:{
    commonjsOptions:{
      include: [ /SimplePeer/,/node_modules/],
    }
  },
});
