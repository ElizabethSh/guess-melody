import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  { ignores: ['dist', 'build', 'coverage'] },
  // Main configuration
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react: react,
      'simple-import-sort': simpleImportSort,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Spread the base rule configurations
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // React Refresh rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Modern React rules (React 17+)
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',

      // TypeScript best practices
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // Import organization
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // React and external packages come first
            ['^react', '^react-dom', '^@?\\w'],
            // Internal packages
            [
              '^(components|utils|hooks|config|settings|types|pages|data|mocks|store|services|hocs)(/.*|$)',
            ],
            // Side effect imports
            ['^\\u0000'],
            // Parent imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Asset imports
            ['^.+\\.(svg|png|jpg|jpeg|gif|webp|ico)$'],
            // Style imports
            ['^.+\\.(s?css|less|sass)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  // Test files configuration - more permissive rules
  {
    files: [
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      '**/test-utils/**/*.{ts,tsx}',
      '**/mocks/**/*.{ts,tsx}',
    ],
    rules: {
      // Allow any types in test files for flexibility with mocks and test setup
      '@typescript-eslint/no-explicit-any': 'off',
      // Allow unused variables in tests (often used for type checking)
      '@typescript-eslint/no-unused-vars': 'off',
      // Allow non-null assertions in tests
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
);
