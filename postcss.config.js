/**
 * PostCSS Configuration File
 * PostCSS is a tool for transforming CSS with JavaScript plugins
 * This configuration is used by Vite to process CSS files
 */
export default {
  // PostCSS plugins to apply during CSS processing
  plugins: {
    // Tailwind CSS plugin - processes Tailwind directives (@tailwind, @apply, etc.)
    tailwindcss: {},
    // Autoprefixer plugin - automatically adds vendor prefixes to CSS rules
    // This ensures cross-browser compatibility by adding -webkit-, -moz-, etc. prefixes
    autoprefixer: {},
  },
};
