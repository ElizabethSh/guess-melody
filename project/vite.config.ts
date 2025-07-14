import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],

  build: {
    outDir: 'build',
    // Generate source maps for production debugging
    sourcemap: true,
    // Optimize bundle splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries that change infrequently
          vendor: ['react', 'react-dom'],
          // React Router for navigation
          router: ['react-router-dom'],
          // Redux state management
          state: ['react-redux', '@reduxjs/toolkit'],
        },
      },
    },
  },

  server: {
    port: 3000,
    open: true,
  },
});
