// Import icons from lucide-react for navigation and download buttons
import { ArrowLeft, Download } from 'lucide-react';
// Import React's useRef hook for creating a reference to the poster DOM element
import { useRef } from 'react';

/**
 * TypeScript interface defining the props for the PosterGenerator component
 */
interface PosterGeneratorProps {
  name: string;              // Main title/name for the poster
  location: string;          // Subtitle/location text
  image: string;             // Base64 data URL of the uploaded image
  filter: string;            // Selected filter/style ID
  font: string;              // Selected font ID
  customOptions: {           // Toggle states for various poster elements
    showBorder: boolean;
    showReward: boolean;
    showCornerDecorations: boolean;
    showSubtitle: boolean;
    showBottomText: boolean;
  };
  onBack: () => void;        // Callback function to return to edit mode
}

/**
 * PosterGenerator component - displays the final generated poster with download capability
 * This component renders the poster based on all user selections and allows downloading as PNG
 */
export default function PosterGenerator({ name, location, image, filter, font, customOptions, onBack }: PosterGeneratorProps) {
  // Create a ref to the poster DOM element for html2canvas to capture
  const posterRef = useRef<HTMLDivElement>(null);

  /**
   * Handler function to download the poster as a PNG image
   * Uses html2canvas library to convert the poster DOM element to a canvas,
   * then converts the canvas to a downloadable PNG file
   */
  const handleDownload = async () => {
    // Exit if the poster ref hasn't been attached to a DOM element yet
    if (!posterRef.current) return;

    try {
      // Dynamically import html2canvas library (code splitting for performance)
      const html2canvas = (await import('html2canvas')).default;
      // Convert the poster DOM element to a canvas with transparent background and 2x scale for quality
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: null,  // Transparent background
        scale: 2,               // 2x resolution for better quality
      });

      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      // Set the download filename, replacing spaces with underscores
      link.download = `${name.replace(/\s+/g, '_')}_poster.png`;
      // Convert canvas to PNG data URL
      link.href = canvas.toDataURL('image/png');
      // Programmatically click the link to trigger download
      link.click();
    } catch (error) {
      // Show user-friendly error message if download fails
      alert('Please try again. If the issue persists, right-click the poster and select "Save Image As"');
    }
  };

  /**
   * Function to map font ID to CSS font-family string
   * @returns CSS font-family string for the selected font
   */
  const getFontFamily = () => {
    switch (font) {
      case 'western':
        return 'Impact, Haettenschweiler, sans-serif';
      case 'oldstyle':
        return 'Georgia, serif';
      case 'display':
        return 'Courier New, monospace';
      case 'decorative':
        return 'Copperplate, Papyrus, fantasy';
      default:
        return 'serif';
    }
  };

  /**
   * Function to get all style properties for the selected filter
   * Each filter returns an object with colors, text content, and image filters
   * @returns Object containing all style properties for the poster
   */
  const getFilterStyles = () => {
    switch (filter) {
      case 'vintage':
        return {
          borderColor: 'border-orange-900',      // Tailwind border color class
          bgColor: 'bg-amber-50',                 // Background color
          textColor: 'text-orange-950',           // Text color
          imageFilter: 'sepia(80%) contrast(110%)', // CSS filter for vintage look
          accentColor: 'bg-orange-900',           // Accent/highlight color
          headerText: 'WANTED',                   // Main header text
          subtitleLabel: 'LAST SEEN IN',          // Label for subtitle section
          bottomNotice: 'APPROACH WITH CAUTION',  // Bottom warning text
          bottomDetail: 'Contact your local Sheriff\'s office with any information' // Detail text
        };
      case 'reward':
        return {
          borderColor: 'border-red-900',
          bgColor: 'bg-red-50',
          textColor: 'text-red-950',
          imageFilter: 'contrast(120%) brightness(90%)',
          accentColor: 'bg-red-900',
          headerText: 'WANTED',
          subtitleLabel: 'LAST SEEN IN',
          bottomNotice: 'WANTED DEAD OR ALIVE',
          bottomDetail: 'Contact your local Sheriff\'s office with any information'
        };
      case 'sheriff':
        return {
          borderColor: 'border-yellow-800',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-950',
          imageFilter: 'contrast(115%) saturate(110%)',
          accentColor: 'bg-yellow-700',
          headerText: 'OFFICIAL NOTICE',
          subtitleLabel: 'LOCATION',
          bottomNotice: 'By Order of the Sheriff',
          bottomDetail: 'Contact the Sheriff\'s office for more information'
        };
      case 'saloon':
        return {
          borderColor: 'border-green-900',
          bgColor: 'bg-green-50',
          textColor: 'text-green-950',
          imageFilter: 'saturate(120%)',
          accentColor: 'bg-green-800',
          headerText: 'LIVE ENTERTAINMENT',
          subtitleLabel: 'PERFORMING AT',
          bottomNotice: 'Join Us Tonight!',
          bottomDetail: 'Reserved seating available - Don\'t miss out!'
        };
      case 'landoffer':
        return {
          borderColor: 'border-blue-900',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-950',
          imageFilter: 'contrast(110%)',
          accentColor: 'bg-blue-800',
          headerText: 'LAND AVAILABLE',
          subtitleLabel: 'LOCATED IN',
          bottomNotice: 'Prime Property - Inquire Within',
          bottomDetail: 'Contact the local land office for more details'
        };
      case 'showbill':
        return {
          borderColor: 'border-red-900',
          bgColor: 'bg-red-100',
          textColor: 'text-red-950',
          imageFilter: 'saturate(130%) contrast(110%)',
          accentColor: 'bg-red-700',
          headerText: 'SPECTACULAR SHOW',
          subtitleLabel: 'PERFORMING AT',
          bottomNotice: 'One Night Only!',
          bottomDetail: 'Reserved seating available - Don\'t miss out!'
        };
      case 'travel':
        return {
          borderColor: 'border-slate-800',
          bgColor: 'bg-slate-100',
          textColor: 'text-slate-950',
          imageFilter: 'contrast(105%)',
          accentColor: 'bg-slate-700',
          headerText: 'TRAVEL IN STYLE',
          subtitleLabel: 'ROUTE',
          bottomNotice: 'Book Your Journey Today',
          bottomDetail: 'Book tickets at the station office'
        };
      default: // Classic filter (default)
        return {
          borderColor: 'border-amber-900',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-950',
          imageFilter: 'none',
          accentColor: 'bg-amber-900',
          headerText: 'WANTED',
          subtitleLabel: 'LAST SEEN IN',
          bottomNotice: 'APPROACH WITH CAUTION',
          bottomDetail: 'Contact your local Sheriff\'s office with any information'
        };
    }
  };

  // Get the style object for the current filter
  const styles = getFilterStyles();
  // Get the font family string for the current font
  const fontFamily = getFontFamily();

  return (
    // Main container with gradient background matching the Wild West theme
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-amber-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header with navigation buttons */}
        <div className="flex justify-between items-center mb-8">
          {/* Back button to return to editor */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-amber-800 text-amber-50 border-4 border-amber-900 hover:bg-amber-900 transition-all font-bold"
          >
            <ArrowLeft size={20} /> {/* Left arrow icon */}
            BACK TO EDITOR
          </button>

          {/* Download button to save poster as PNG */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white border-4 border-green-900 hover:bg-green-800 transition-all font-bold"
          >
            <Download size={20} /> {/* Download icon */}
            DOWNLOAD POSTER
          </button>
        </div>

        {/* Poster container with max width */}
        <div className="max-w-3xl mx-auto">
          {/* The actual poster - this div is captured by html2canvas */}
          {/* Attach ref for html2canvas */}
          <div
            ref={posterRef}
            className={`${styles.bgColor} border-8 ${styles.borderColor} shadow-2xl p-8 relative`}
          >
            {/* Conditionally render decorative corner brackets if showBorder is true */}
            {customOptions.showBorder && (
              <>
                {/* Top-left corner bracket */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-4 border-l-4 border-amber-800"></div>
                {/* Top-right corner bracket */}
                <div className="absolute top-3 right-3 w-6 h-6 border-t-4 border-r-4 border-amber-800"></div>
                {/* Bottom-left corner bracket */}
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-4 border-l-4 border-amber-800"></div>
                {/* Bottom-right corner bracket */}
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-4 border-r-4 border-amber-800"></div>
              </>
            )}

            {/* Header section with title and optional reward banner */}
            <div className={`text-center border-b-4 ${styles.borderColor} pb-6 mb-6`}>
              {/* Main header text (e.g., "WANTED", "OFFICIAL NOTICE") */}
              <h1 className={`text-7xl font-bold ${styles.textColor} mb-2 tracking-wider`} style={{ fontFamily }}>
                {styles.headerText}
              </h1>
              {/* Conditionally show reward banner for certain filter types */}
              {customOptions.showReward && (filter === 'reward' || filter === 'classic' || filter === 'vintage') && (
                <div className={`${styles.accentColor} text-white py-2 px-4 inline-block border-2 ${styles.borderColor}`}>
                  <p className="text-3xl font-bold" style={{ fontFamily }}>$5,000 REWARD</p>
                </div>
              )}
            </div>

            {/* Image section with border and optional film grain overlay */}
            <div className={`border-8 ${styles.borderColor} mb-6 bg-gray-900 relative overflow-hidden`}>
              {/* The main poster image with CSS filter applied */}
              {/* Apply sepia, contrast, etc. filters */}
              <img
                src={image}
                alt={name}
                className="w-full h-auto"
                style={{ filter: styles.imageFilter }}
              />
              {/* Horizontal line overlay to simulate old photograph/film grain effect */}
              <div className="absolute inset-0 pointer-events-none opacity-10" style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)`
              }}></div>
            </div>

            {/* Name and location section */}
            <div className={`border-4 ${styles.borderColor} ${styles.bgColor} p-6 mb-4`}>
              <div className="text-center mb-4">
                {/* User's entered name/title in uppercase */}
                <h2 className={`text-5xl font-bold ${styles.textColor} mb-2 tracking-wide`} style={{ fontFamily }}>
                  {name.toUpperCase()}
                </h2>
                {/* Decorative underline bar */}
                <div className={`h-1 ${styles.accentColor} w-32 mx-auto mb-4`}></div>
              </div>

              {/* Conditionally show subtitle/location box if enabled and location is provided */}
              {customOptions.showSubtitle && location && (
                <div className={`${styles.accentColor} text-white p-4 text-center border-2 ${styles.borderColor}`}>
                  {/* Label (e.g., "LAST SEEN IN", "PERFORMING AT") */}
                  <p className="text-sm tracking-widest mb-1" style={{ fontFamily }}>
                    {styles.subtitleLabel}
                  </p>
                  {/* User's entered location in uppercase */}
                  <p className="text-2xl font-bold tracking-wider" style={{ fontFamily }}>
                    {location.toUpperCase()}
                  </p>
                </div>
              )}
            </div>

            {/* Conditionally show bottom notice/warning text if enabled */}
            {customOptions.showBottomText && (
              <div className={`text-center ${styles.textColor} text-sm`}>
                {/* Bold notice text (e.g., "APPROACH WITH CAUTION") */}
                <p className="mb-2 font-bold tracking-wider" style={{ fontFamily }}>
                  {styles.bottomNotice}
                </p>
                {/* Italic detail text (e.g., "Contact your local Sheriff's office") */}
                <p className="italic" style={{ fontFamily }}>
                  {styles.bottomDetail}
                </p>
              </div>
            )}

            {/* Conditionally show decorative diamond corner accents if enabled */}
            {customOptions.showCornerDecorations && (
              <>
                {/* Top center diamond accent - rotated 45 degrees */}
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${styles.accentColor} w-8 h-8 rotate-45 border-4 ${styles.borderColor}`}></div>
                {/* Bottom center diamond accent - rotated 45 degrees */}
                <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 ${styles.accentColor} w-8 h-8 rotate-45 border-4 ${styles.borderColor}`}></div>
              </>
            )}
          </div>

          {/* Success message below the poster */}
          <div className="mt-8 text-center">
            <p className={`${styles.textColor} text-lg font-bold italic`} style={{ fontFamily }}>
              Your Wild West poster is ready!
            </p>
            <p className="text-amber-800 mt-2">
              Click the download button above to save your poster
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
