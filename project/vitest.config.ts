import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: [
        'node_modules',
        'dist',
        '.idea',
        '.git',
        '.cache',
        'build',
        'coverage',
      ],
      coverage: {
        provider: 'v8',
        reporter: ['text'],
        include: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: ['src/types/**/*.{ts,tsx}', 'src/reportWebVitals.ts'],
      },
    },
  }),
);
