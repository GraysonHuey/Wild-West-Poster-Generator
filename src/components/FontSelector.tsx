// Import Type icon from lucide-react for typography-related UI
import { Type } from 'lucide-react';

/**
 * TypeScript interface defining the props for the FontSelector component
 */
interface FontSelectorProps {
  selectedFont: string;                   // The currently selected font ID
  onFontChange: (font: string) => void;   // Callback function when font selection changes
}

/**
 * Array of font options available for poster text
 * Each font object contains an ID, display name, and CSS font-family string
 */
const fonts = [
  { id: 'serif', name: 'Classic Serif', style: 'serif' },
  { id: 'western', name: 'Bold Western', style: 'Impact, Haettenschweiler, sans-serif' },
  { id: 'oldstyle', name: 'Old Style', style: 'Georgia, serif' },
  { id: 'display', name: 'Display', style: 'Courier New, monospace' },
  { id: 'decorative', name: 'Decorative', style: 'Copperplate, Papyrus, fantasy' }
];

/**
 * FontSelector component - allows users to choose a typography style for the poster
 * Displays a grid of clickable font options with live previews of each font
 */
export default function FontSelector({ selectedFont, onFontChange }: FontSelectorProps) {
  return (
    <div>
      {/* Section label with icon */}
      <label className="flex items-center gap-2 text-amber-900 font-bold mb-3 text-lg">
        <Type size={24} /> {/* Typography icon */}
        Select Font Style
      </label>
      {/* Grid layout for font buttons - 2 columns on mobile, 3 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Map through each font to create a button */}
        {/* Each button has a unique key for React list rendering */}
        {fonts.map((font) => (
          <button
            key={font.id}
            onClick={() => onFontChange(font.id)}
            className={`p-4 border-4 transition-all text-center ${
              // Conditional styling: highlighted if selected, normal hover state otherwise
              selectedFont === font.id
                ? 'border-amber-900 bg-amber-200 scale-105 shadow-lg'
                : 'border-amber-700 bg-amber-100 hover:bg-amber-150 hover:border-amber-800'
            }`}
          >
            {/* Font preview showing "Aa" in the actual font style */}
            {/* Apply the font's CSS style inline */}
            <p
              className="text-2xl font-bold text-amber-900 mb-1"
              style={{ fontFamily: font.style }}
            >
              Aa
            </p>
            {/* Font name label */}
            <p className="text-sm text-amber-800">{font.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
