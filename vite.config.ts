// Import the defineConfig function from Vite to get TypeScript support for configuration
import { defineConfig } from 'vite';
// Import the official React plugin for Vite that enables React Fast Refresh and JSX support
import react from '@vitejs/plugin-react';

// Official Vite configuration documentation: https://vitejs.dev/config/
// Export the Vite configuration object
export default defineConfig({
  // Array of Vite plugins to use
  plugins: [react()], // Enable React plugin for JSX transformation and Fast Refresh
  // Dependency optimization configuration
  optimizeDeps: {
    // Exclude lucide-react from pre-bundling to avoid potential issues
    // This is useful for packages that have ESM-only dependencies
    exclude: ['lucide-react'],
  },
});
