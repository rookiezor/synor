module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
      project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    env: {
      browser: true,
      node: true,
      es6: true,
      jest: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:prettier/recommended',
      'plugin:security/recommended',
    ],
    plugins: [
      '@typescript-eslint',
      'react',
      'react-hooks',
      'jsx-a11y',
      'import',
      'prettier',
      'security',
      'simple-import-sort',
      'unused-imports',
    ],
    rules: {
      // TypeScript
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
  
      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
  
      // Import
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-cycle': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
  
      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'no-param-reassign': 'error',
      'no-return-await': 'error',
      'require-await': 'error',
  
      // Security
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-eval-with-expression': 'error',
  
      // Prettier
      'prettier/prettier': ['error', {
        singleQuote: true,
        trailingComma: 'es5',
        printWidth: 100,
        tabWidth: 2,
        semi: true,
      }],
    },
    overrides: [
      // Backend API specific rules
      {
        files: ['apps/api/**/*.ts'],
        rules: {
          '@typescript-eslint/explicit-function-return-type': 'error',
          'security/detect-possible-timing-attacks': 'error',
        },
      },
      // Frontend specific rules
      {
        files: ['apps/web/**/*.{ts,tsx}'],
        rules: {
          'jsx-a11y/anchor-is-valid': 'error',
          'react/no-danger': 'error',
        },
      },
      // Test files
      {
        files: ['**/*.test.ts', '**/*.spec.ts', '**/tests/**/*.ts'],
        env: {
          jest: true,
          'jest/globals': true,
        },
        extends: ['plugin:jest/recommended', 'plugin:jest/style'],
        plugins: ['jest'],
        rules: {
          '@typescript-eslint/no-explicit-any': 'off',
          'jest/expect-expect': 'error',
          'jest/no-disabled-tests': 'warn',
          'jest/no-focused-tests': 'error',
          'jest/no-identical-title': 'error',
          'jest/valid-expect': 'error',
        },
      },
    ],
    ignorePatterns: [
      'node_modules',
      'build',
      'dist',
      '.next',
      'coverage',
      '*.js',
      '*.d.ts',
    ],
  };