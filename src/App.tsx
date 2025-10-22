// Import React's useState hook for managing component state
import { useState } from 'react';
// Import icon components from lucide-react library for UI decoration
import { Camera, MapPin, User, Image as ImageIcon, Download } from 'lucide-react';
// Import custom components for different parts of the poster generator
import PosterGenerator from './components/PosterGenerator';
import FilterSelector from './components/FilterSelector';
import FontSelector from './components/FontSelector';
import CustomizationPanel from './components/CustomizationPanel';
// Import face detection utility functions
import { processImageWithFaceDetection } from './utils/faceDetection';

/**
 * Main App component that serves as the entry point for the Wild West Poster Generator
 * This component manages the poster creation form and switches between edit and preview modes
 */
function App() {
  // State for storing the main title/name entered by the user (required field)
  const [name, setName] = useState('');

  // State for storing the subtitle/location entered by the user (optional field)
  const [location, setLocation] = useState('');

  // State for storing the uploaded image as a base64 data URL string, null if no image selected
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // State for tracking which poster style filter is currently selected (default: 'classic')
  const [selectedFilter, setSelectedFilter] = useState('classic');

  // State for tracking which font style is currently selected (default: 'serif')
  const [selectedFont, setSelectedFont] = useState('serif');

  // State object containing all customization toggles for poster elements
  // Each boolean controls whether a specific poster element is displayed
  const [customOptions, setCustomOptions] = useState({
    showBorder: true,              // Controls decorative corner borders
    showReward: true,              // Controls reward amount banner display
    showCornerDecorations: true,   // Controls diamond corner accent pieces
    showSubtitle: true,            // Controls highlighted subtitle box
    showBottomText: true           // Controls bottom notice text
  });

  // State controlling whether to show the poster preview (true) or edit form (false)
  const [showPoster, setShowPoster] = useState(false);

  // State for tracking image processing status
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // State for tracking whether a face was detected in the uploaded image
  const [faceDetected, setFaceDetected] = useState<boolean | null>(null);

  // State controlling whether face detection is enabled
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(true);

  // Store original unprocessed image
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  /**
   * Handler function to update a single customization option
   * @param option - The name of the option to change (e.g., 'showBorder')
   * @param value - The new boolean value for the option
   */
  const handleCustomOptionChange = (option: string, value: boolean) => {
    // Update the customOptions state by spreading the previous state and overriding the specified option
    setCustomOptions(prev => ({ ...prev, [option]: value }));
  };

  /**
   * Handler function for toggling face detection on/off
   * Reprocesses the existing image when toggled
   * @param enabled - Whether face detection should be enabled
   */
  const handleFaceDetectionToggle = async (enabled: boolean) => {
    // Update the face detection enabled state
    setFaceDetectionEnabled(enabled);

    // If there's an original image, reprocess it based on the new setting
    if (originalImage) {
      setIsProcessingImage(true);
      setFaceDetected(null);

      try {
        if (enabled) {
          // Face detection enabled - process the original image
          const result = await processImageWithFaceDetection(originalImage);
          setSelectedImage(result.processedImage);
          setFaceDetected(result.faceDetected);
          console.log(result.faceDetected ? 'Face detected and image cropped' : 'No face detected, using original image');
        } else {
          // Face detection disabled - use original image
          setSelectedImage(originalImage);
          setFaceDetected(null);
          console.log('Face detection disabled, using original image');
        }
      } catch (error) {
        console.error('Error reprocessing image:', error);
        // If processing fails, use the original image
        setSelectedImage(originalImage);
        setFaceDetected(false);
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  /**
   * Handler function for image file upload
   * Converts the uploaded image file to a base64 data URL and processes it with face detection
   * @param e - The change event from the file input element
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the first file from the input (only one file can be selected)
    const file = e.target.files?.[0];
    if (file) {
      // Reset face detection state
      setFaceDetected(null);
      setIsProcessingImage(true);

      // Create a FileReader to read the file contents
      const reader = new FileReader();

      // Set up callback for when file reading is complete
      reader.onloadend = async () => {
        const imageDataUrl = reader.result as string;

        // Store the original image
        setOriginalImage(imageDataUrl);

        try {
          // Only process with face detection if enabled
          if (faceDetectionEnabled) {
            // Process the image with face detection
            const result = await processImageWithFaceDetection(imageDataUrl);

            // Store the processed image (cropped if face detected, original otherwise)
            setSelectedImage(result.processedImage);

            // Update face detection status
            setFaceDetected(result.faceDetected);

            console.log(result.faceDetected ? 'Face detected and image cropped' : 'No face detected, using original image');
          } else {
            // Face detection disabled - use original image
            setSelectedImage(imageDataUrl);
            setFaceDetected(null);
            console.log('Face detection disabled, using original image');
          }
        } catch (error) {
          console.error('Error processing image:', error);
          // If processing fails, use the original image
          setSelectedImage(imageDataUrl);
          setFaceDetected(false);
        } finally {
          setIsProcessingImage(false);
        }
      };

      // Start reading the file as a data URL (base64 encoded)
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handler function to generate and display the poster
   * Only proceeds if both required fields (name and image) are filled
   */
  const handleGeneratePoster = () => {
    // Validate that required fields are present before showing poster
    if (name && selectedImage) {
      // Switch to poster preview mode
      setShowPoster(true);
    }
  };

  /**
   * Handler function to return from poster preview back to the edit form
   */
  const handleReset = () => {
    // Switch back to edit mode (does not clear form data)
    setShowPoster(false);
  };

  // If we're in poster preview mode and have a selected image, render the PosterGenerator component
  if (showPoster && selectedImage) {
    return (
      <PosterGenerator
        name={name}                          // Pass the main title/name
        location={location}                  // Pass the subtitle/location
        image={selectedImage}                // Pass the image data URL
        filter={selectedFilter}              // Pass the selected filter style
        font={selectedFont}                  // Pass the selected font style
        customOptions={customOptions}        // Pass all customization toggles
        onBack={handleReset}                 // Pass the back button handler
      />
    );
  }

  // Render the main edit form view
  return (
    // Full-height container with amber/orange gradient background (Wild West theme)
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-amber-100">
      {/* Decorative background pattern overlay with cross/star shapes */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B4513' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Main content container, positioned relative to sit above the background pattern */}
      <div className="relative container mx-auto px-4 py-12">
        {/* Page header with title */}
        <header className="text-center mb-12">
          <div className="inline-block">
            {/* Main title in large serif font */}
            <h1 className="text-6xl font-bold text-amber-900 mb-2 tracking-wider" style={{ fontFamily: 'serif' }}>
              WILD WEST
            </h1>
            {/* Decorative horizontal divider line */}
            <div className="h-1 bg-amber-800"></div>
            {/* Subtitle describing the application */}
            <p className="text-xl text-amber-800 mt-2 tracking-widest" style={{ fontFamily: 'serif' }}>
              POSTER GENERATOR
            </p>
          </div>
        </header>

        {/* Main form container with max width */}
        <div className="max-w-4xl mx-auto">
          {/* Form card with thick border and shadow to mimic old poster aesthetic */}
          <div className="bg-amber-50 border-8 border-amber-900 shadow-2xl p-8 relative">
            {/* Decorative corner brackets - top left */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-800"></div>
            {/* Decorative corner brackets - top right */}
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-800"></div>
            {/* Decorative corner brackets - bottom left */}
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-800"></div>
            {/* Decorative corner brackets - bottom right */}
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-800"></div>

            {/* Form fields container with vertical spacing */}
            <div className="space-y-6">
              {/* Name/Title input field (required) */}
              <div>
                <label className="flex items-center gap-2 text-amber-900 font-bold mb-2 text-lg">
                  <User size={24} /> {/* User icon */}
                  Title / Name <span className="text-amber-700 font-normal text-sm ml-1">(Required)</span>
                </label>
                {/* Text input for the main poster title/name */}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter main title or name"
                  className="w-full px-4 py-3 border-4 border-amber-800 bg-amber-50 text-amber-900 placeholder-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-600 text-lg"
                />
              </div>

              {/* Location/Subtitle input field (optional) */}
              <div>
                <label className="flex items-center gap-2 text-amber-900 font-bold mb-2 text-lg">
                  <MapPin size={24} /> {/* Map pin icon */}
                  Subtitle / Location <span className="text-amber-700 font-normal text-sm ml-1">(Optional)</span>
                </label>
                {/* Text input for the subtitle/location */}
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter subtitle or location (optional)"
                  className="w-full px-4 py-3 border-4 border-amber-800 bg-amber-50 text-amber-900 placeholder-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-600 text-lg"
                />

                {/* Face detection toggle */}
                <div className="mt-3 p-3 bg-amber-100 border-2 border-amber-700 rounded">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={faceDetectionEnabled}
                      onChange={(e) => handleFaceDetectionToggle(e.target.checked)}
                      disabled={isProcessingImage}
                      className="w-5 h-5 text-amber-800 border-amber-800 focus:ring-amber-600 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-amber-900 text-sm">Automatic Face Detection & Cropping</p>
                      <p className="text-xs text-amber-800">
                        {faceDetectionEnabled
                          ? 'Images will be automatically cropped to center detected faces'
                          : 'Images will be used as uploaded without face detection'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Image upload section */}
              <div>
                <label className="flex items-center gap-2 text-amber-900 font-bold mb-2 text-lg">
                  <Camera size={24} /> {/* Camera icon */}
                  Upload Photo
                </label>
                {/* Dropzone-style area for image upload */}
                <div className="border-4 border-dashed border-amber-800 bg-amber-100 p-8 text-center hover:bg-amber-200 transition-colors cursor-pointer">
                  {/* Hidden file input element that accepts any image type */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  {/* Clickable label that triggers the file input */}
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {/* Show processing indicator while detecting face */}
                    {isProcessingImage ? (
                      <div>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
                        <p className="text-amber-900 font-bold">Detecting face...</p>
                        <p className="text-amber-700 text-sm mt-2">Please wait</p>
                      </div>
                    ) : selectedImage ? (
                      <div>
                        {/* Image preview thumbnail */}
                        <img src={selectedImage} alt="Preview" className="max-h-48 mx-auto mb-4 border-4 border-amber-800" />
                        <p className="text-amber-900 font-bold">Click to change photo</p>
                        {/* Show face detection status */}
                        {faceDetected === true && (
                          <p className="text-green-700 text-sm mt-2">✓ Face detected and centered</p>
                        )}
                        {faceDetected === false && (
                          <p className="text-amber-700 text-sm mt-2">No face detected - using original image</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        {/* Upload icon and instructions when no image selected */}
                        <ImageIcon size={48} className="mx-auto mb-4 text-amber-800" />
                        <p className="text-amber-900 font-bold">Click to upload a photo</p>
                        <p className="text-amber-700 text-sm mt-2">
                          {faceDetectionEnabled ? 'Automatic face detection & centering' : 'Upload your photo'}
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Filter/Style selector component - allows choosing poster style theme */}
              <FilterSelector
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
              />

              {/* Font selector component - allows choosing typography style */}
              <FontSelector
                selectedFont={selectedFont}
                onFontChange={setSelectedFont}
              />

              {/* Customization panel component - allows toggling poster elements on/off */}
              <CustomizationPanel
                selectedFilter={selectedFilter}
                options={customOptions}
                onOptionChange={handleCustomOptionChange}
              />

              {/* Generate poster button - disabled if required fields are not filled */}
              {/* Button is disabled when name or image is missing */}
              <button
                onClick={handleGeneratePoster}
                disabled={!name || !selectedImage}
                className={`w-full py-4 text-xl font-bold tracking-wider border-4 transition-all ${
                  // Conditional styling: active button style if fields are filled, disabled style otherwise
                  name && selectedImage
                    ? 'bg-amber-800 text-amber-50 border-amber-900 hover:bg-amber-900 hover:scale-105 shadow-lg hover:shadow-xl'
                    : 'bg-gray-400 text-gray-600 border-gray-500 cursor-not-allowed'
                }`}
              >
                {/* Button text changes based on whether required fields are filled */}
                {name && selectedImage ? (
                  <span className="flex items-center justify-center gap-2">
                    <Download size={24} /> {/* Download icon */}
                    GENERATE POSTER
                  </span>
                ) : (
                  'FILL IN REQUIRED FIELDS TO GENERATE'
                )}
              </button>
            </div>
          </div>

          {/* Tagline/motto at the bottom of the form */}
          <div className="mt-8 text-center">
            <p className="text-amber-800 italic" style={{ fontFamily: 'serif' }}>
              "Create your own legendary Wild West poster"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the App component as the default export
export default App;
