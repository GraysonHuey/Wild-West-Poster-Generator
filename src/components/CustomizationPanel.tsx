// Import Settings icon from lucide-react for customization UI
import { Settings } from 'lucide-react';

/**
 * TypeScript interface defining the props for the CustomizationPanel component
 */
interface CustomizationPanelProps {
  selectedFilter: string;    // Currently selected filter to determine which options to show
  options: {                 // Object containing all toggle states
    showBorder: boolean;
    showReward: boolean;
    showCornerDecorations: boolean;
    showSubtitle: boolean;
    showBottomText: boolean;
  };
  onOptionChange: (option: string, value: boolean) => void;  // Callback when an option is toggled
}

/**
 * CustomizationPanel component - provides toggle controls for poster elements
 * Options displayed change based on the selected filter/style
 */
export default function CustomizationPanel({ selectedFilter, options, onOptionChange }: CustomizationPanelProps) {
  /**
   * Function to generate the list of toggle options based on the selected filter
   * Different filters show different customization options relevant to their style
   * @returns Array of option objects with id, label, and description
   */
  const getToggleOptions = () => {
    // Base options that are available for all filter types
    const baseOptions = [
      { id: 'showBorder', label: 'Decorative Border', description: 'Corner decorations' },
      { id: 'showCornerDecorations', label: 'Corner Accents', description: 'Diamond corner pieces' }
    ];

    // Filter-specific options - each filter type has unique options
    // Record type maps filter names to arrays of option objects
    const filterSpecificOptions: Record<string, any[]> = {
      classic: [
        { id: 'showReward', label: 'Reward Amount', description: 'Display reward banner' },
        { id: 'showSubtitle', label: 'Subtitle Box', description: 'Show highlighted subtitle' },
        { id: 'showBottomText', label: 'Bottom Notice', description: 'Sheriff contact text' }
      ],
      vintage: [
        { id: 'showReward', label: 'Reward Amount', description: 'Display reward banner' },
        { id: 'showSubtitle', label: 'Subtitle Box', description: 'Show highlighted subtitle' },
        { id: 'showBottomText', label: 'Bottom Notice', description: 'Contact information' }
      ],
      reward: [
        { id: 'showReward', label: 'Reward Amount', description: 'Display reward banner' },
        { id: 'showSubtitle', label: 'Subtitle Box', description: 'Show highlighted subtitle' },
        { id: 'showBottomText', label: 'Bottom Warning', description: 'Dead or alive notice' }
      ],
      sheriff: [
        { id: 'showSubtitle', label: 'Subtitle Box', description: 'Show highlighted subtitle' },
        { id: 'showBottomText', label: 'Official Notice', description: 'Sheriff badge text' }
      ],
      saloon: [
        { id: 'showSubtitle', label: 'Venue Box', description: 'Show venue location' },
        { id: 'showBottomText', label: 'Event Details', description: 'Show event information' }
      ],
      landoffer: [
        { id: 'showSubtitle', label: 'Location Box', description: 'Show property location' },
        { id: 'showBottomText', label: 'Contact Info', description: 'Land office details' }
      ],
      showbill: [
        { id: 'showSubtitle', label: 'Venue Box', description: 'Show performance venue' },
        { id: 'showBottomText', label: 'Show Details', description: 'Ticket information' }
      ],
      travel: [
        { id: 'showSubtitle', label: 'Route Box', description: 'Show departure/destination' },
        { id: 'showBottomText', label: 'Booking Info', description: 'Ticket office details' }
      ]
    };

    // Combine base options with filter-specific options
    // If selectedFilter doesn't exist in the map, default to classic options
    return [...baseOptions, ...(filterSpecificOptions[selectedFilter] || filterSpecificOptions.classic)];
  };

  // Get the options array for the current filter
  const toggleOptions = getToggleOptions();

  return (
    <div>
      {/* Section label with icon */}
      <label className="flex items-center gap-2 text-amber-900 font-bold mb-3 text-lg">
        <Settings size={24} /> {/* Settings/gear icon */}
        Customize Poster Elements
      </label>
      {/* Container for all toggle options */}
      <div className="border-4 border-amber-800 bg-amber-100 p-4">
        {/* Grid layout - 1 column on mobile, 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Map through each option to create a checkbox control */}
          {/* Each option has a unique key for React list rendering */}
          {toggleOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-start gap-3 p-3 bg-amber-50 border-2 border-amber-700 hover:bg-amber-200 cursor-pointer transition-colors"
            >
              {/* Checkbox input - checked state controlled by options prop */}
              {/* Get current value from options object */}
              {/* Call parent's handler with new value on change */}
              <input
                type="checkbox"
                checked={options[option.id as keyof typeof options]}
                onChange={(e) => onOptionChange(option.id, e.target.checked)}
                className="mt-1 w-5 h-5 text-amber-800 border-amber-800 focus:ring-amber-600"
              />
              {/* Text content for the option */}
              <div className="flex-1">
                {/* Option label/title */}
                <p className="font-bold text-amber-900">{option.label}</p>
                {/* Option description/subtitle */}
                <p className="text-sm text-amber-800">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
