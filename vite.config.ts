import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import angular from '@analogjs/vite-plugin-angular';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    angular(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
    'import.meta.env.VITE_MCP_SERVER_URL': JSON.stringify(process.env.VITE_MCP_SERVER_URL),
    'import.meta.env.VITE_MCP_FEATURES': JSON.stringify(process.env.VITE_MCP_FEATURES),
    'import.meta.env.VITE_APP_NAME': JSON.stringify(process.env.VITE_APP_NAME),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.VITE_APP_VERSION),
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL),
    'import.meta.env.VITE_ENABLE_MCP': JSON.stringify(process.env.VITE_ENABLE_MCP),
    'import.meta.env.VITE_ENABLE_ANALYTICS': JSON.stringify(process.env.VITE_ENABLE_ANALYTICS),
  },
  server: {
    port: 4200,
    host: true,
  },
  build: {
    outDir: 'www',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['@angular/core', '@ionic/angular'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@angular/common', '@angular/core', '@ionic/angular'],
  },
});