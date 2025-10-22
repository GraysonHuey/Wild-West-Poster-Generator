// Import Star icon from lucide-react for UI decoration
import { Star } from 'lucide-react';

/**
 * TypeScript interface defining the props for the FilterSelector component
 */
interface FilterSelectorProps {
  selectedFilter: string;                     // The currently selected filter ID
  onFilterChange: (filter: string) => void;   // Callback function when filter selection changes
}

/**
 * Array of filter/style options available for poster generation
 * Each filter defines a unique visual theme with associated colors and text
 */
const filters = [
  {
    id: 'classic',                             // Unique identifier for this filter
    name: 'Classic Wanted',                    // Display name shown to user
    description: 'Traditional wanted poster',  // Brief description of the style
    preview: 'bg-amber-800'                    // Tailwind class for preview color
  },
  {
    id: 'vintage',
    name: 'Vintage Sepia',
    description: 'Aged photograph effect',
    preview: 'bg-orange-900'
  },
  {
    id: 'reward',
    name: 'Reward Notice',
    description: 'High reward bounty',
    preview: 'bg-red-900'
  },
  {
    id: 'sheriff',
    name: 'Sheriff Badge',
    description: 'Official law enforcement',
    preview: 'bg-yellow-700'
  },
  {
    id: 'saloon',
    name: 'Saloon Poster',
    description: 'Entertainment & events',
    preview: 'bg-green-800'
  },
  {
    id: 'landoffer',
    name: 'Land Offer',
    description: 'Property advertisement',
    preview: 'bg-blue-800'
  },
  {
    id: 'showbill',
    name: 'Show Bill',
    description: 'Performance poster',
    preview: 'bg-red-700'
  },
  {
    id: 'travel',
    name: 'Travel Poster',
    description: 'Railroad & stagecoach',
    preview: 'bg-slate-700'
  }
];

/**
 * FilterSelector component - allows users to choose a poster style/theme
 * Displays a grid of clickable filter options with color previews
 */
export default function FilterSelector({ selectedFilter, onFilterChange }: FilterSelectorProps) {
  return (
    <div>
      {/* Section label with icon */}
      <label className="flex items-center gap-2 text-amber-900 font-bold mb-3 text-lg">
        <Star size={24} /> {/* Star icon */}
        Select Poster Style
      </label>
      {/* Grid layout for filter buttons - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Map through each filter to create a button */}
        {/* Each button has a unique key for React list rendering */}
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`p-3 border-4 transition-all text-left ${
              // Conditional styling: highlighted if selected, normal hover state otherwise
              selectedFilter === filter.id
                ? 'border-amber-900 bg-amber-200 scale-105 shadow-lg'
                : 'border-amber-700 bg-amber-100 hover:bg-amber-150 hover:border-amber-800'
            }`}
          >
            {/* Color preview bar showing the filter's theme color */}
            <div className={`w-full h-12 ${filter.preview} border-2 border-amber-900 mb-2`}></div>
            {/* Filter name */}
            <h3 className="font-bold text-amber-900 text-sm">{filter.name}</h3>
            {/* Filter description */}
            <p className="text-xs text-amber-800">{filter.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
