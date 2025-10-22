/**
 * Tailwind CSS Configuration File
 * @type {import('tailwindcss').Config}
 * This JSDoc comment provides TypeScript intellisense for the configuration
 */
export default {
  // Content paths - tells Tailwind which files to scan for class names
  // Tailwind will only include styles for classes found in these files
  content: [
    './index.html',                    // Scan the main HTML file
    './src/**/*.{js,ts,jsx,tsx}'       // Scan all JavaScript/TypeScript files in src directory
  ],
  // Theme customization
  theme: {
    // Extend the default Tailwind theme (currently no custom extensions)
    extend: {},
  },
  // Plugins array - add third-party Tailwind plugins here
  plugins: [],
};
