import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [tsconfigPaths(), react()],
  server: {
    port: 3000,
    open: true,
  },
});
