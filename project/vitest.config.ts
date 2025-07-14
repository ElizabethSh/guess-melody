import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],

      // File patterns
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: [
        'node_modules',
        'dist',
        'build',
        'coverage',
        '**/*.config.{js,ts}',
      ],

      // Enhanced reporting
      reporters: ['verbose'],

      // Test timeouts
      testTimeout: 10000,
      hookTimeout: 10000,

      // Coverage configuration
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: [
          'src/types/**/*.{ts,tsx}',
          'src/index.tsx', // Entry point
          'src/setupTests.ts', // Test setup
          'src/**/*.d.ts', // Type definitions
          'src/**/*.test.{js,ts,jsx,tsx}', // Test files
          'src/**/*.spec.{js,ts,jsx,tsx}', // Spec files
          'src/mocks/**/*', // Mock data
        ],
        all: true,
      },

      // Retry flaky tests
      retry: 2,

      // Mock configuration
      clearMocks: true,
      restoreMocks: true,

      // Environment configuration
      environmentOptions: {
        jsdom: {
          resources: 'usable',
        },
      },
    },
  }),
);
