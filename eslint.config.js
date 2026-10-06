import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

const frontendFiles = ['src/**/*.{js,jsx}'];
const nodeFiles = [
  'server/**/*.mjs',
  'scripts/**/*.mjs',
  'vite.config.js',
  'eslint.config.js',
];

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'data/**',
      'public/**',
      '**/*.min.js',
    ],
  },

  {
    files: frontendFiles,

    ...js.configs.recommended,

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },

      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
  },

  {
    files: frontendFiles,

    plugins: {
      ...eslintReact.configs.recommended.plugins,
      'react-hooks': reactHooks,
    },

    rules: {
      ...eslintReact.configs.recommended.rules,
      ...reactHooks.configs.flat.recommended.rules,

      '@eslint-react/exhaustive-deps': 'off',
      '@eslint-react/set-state-in-effect': 'off',
      'react-hooks/set-state-in-effect': 'off',

      eqeqeq: ['error', 'always'],

      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  {
    files: nodeFiles,

    ...js.configs.recommended,

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.nodeBuiltin,
        fetch: 'readonly',
        FormData: 'readonly',
        Headers: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
      },
    },

    rules: {
      eqeqeq: ['error', 'always'],

      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  eslintConfigPrettier,
];
