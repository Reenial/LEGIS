import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    // Same setup as nginx in production: the app calls /api on its own origin,
    // so the session cookie is first-party. Override the target with VITE_PROXY_TARGET.
    proxy: {
      '/api': process.env.VITE_PROXY_TARGET || 'http://localhost:10000',
    },
  },
});
