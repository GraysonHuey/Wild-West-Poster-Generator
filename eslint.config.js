// Import the base ESLint JavaScript configuration
import js from '@eslint/js';
// Import globals definitions for different JavaScript environments
import globals from 'globals';
// Import the React Hooks ESLint plugin for enforcing Rules of Hooks
import reactHooks from 'eslint-plugin-react-hooks';
// Import the React Refresh ESLint plugin for Fast Refresh compatibility
import reactRefresh from 'eslint-plugin-react-refresh';
// Import TypeScript ESLint configuration utilities
import tseslint from 'typescript-eslint';

/**
 * ESLint Configuration
 * This configuration uses the new flat config format
 * It sets up linting rules for TypeScript and React code
 */
export default tseslint.config(
  // First configuration object - specify files to ignore
  { ignores: ['dist'] }, // Ignore the build output directory

  // Second configuration object - main linting rules
  {
    // Extend from recommended configurations
    extends: [
      js.configs.recommended,           // ESLint's recommended JavaScript rules
      ...tseslint.configs.recommended   // TypeScript ESLint's recommended rules
    ],
    // Specify which files this configuration applies to
    files: ['**/*.{ts,tsx}'], // Apply to all TypeScript and TSX files

    // Language options configuration
    languageOptions: {
      ecmaVersion: 2020,        // Use ECMAScript 2020 syntax
      globals: globals.browser, // Include browser global variables (window, document, etc.)
    },

    // ESLint plugins to use
    plugins: {
      'react-hooks': reactHooks,       // Plugin for React Hooks rules
      'react-refresh': reactRefresh,   // Plugin for React Fast Refresh compatibility
    },

    // Linting rules configuration
    rules: {
      // Spread all recommended React Hooks rules (enforces Rules of Hooks)
      ...reactHooks.configs.recommended.rules,
      // Warn if components are not exported correctly for Fast Refresh
      // allowConstantExport allows exporting constants alongside components
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
