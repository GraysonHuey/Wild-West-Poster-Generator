// Dynamic import of face-api.js library for code splitting
// This reduces initial bundle size and loads the library only when needed
let faceapi: typeof import('face-api.js');

// Track whether models have been loaded to avoid reloading
let modelsLoaded = false;

/**
 * Load face detection models from CDN
 * Models are loaded only once and cached for subsequent use
 * Uses the TinyFaceDetector model for fast, lightweight detection
 */
export async function loadModels(): Promise<void> {
  // Skip if models are already loaded
  if (modelsLoaded) return;

  try {
    if (!faceapi) {
      faceapi = await import('face-api.js');
    }

    // Load models from jsdelivr CDN (public mirror of face-api.js models)
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

    // Load the TinyFaceDetector model (lightweight and fast)
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

    modelsLoaded = true;
    console.log('Face detection models loaded successfully');
  } catch (error) {
    console.error('Error loading face detection models:', error);
    throw error;
  }
}

/**
 * Detect faces in an image and return the bounding box of the first detected face
 * @param imageElement - HTML Image element containing the photo
 * @returns Promise with face detection result including bounding box coordinates
 */
export async function detectFace(imageElement: HTMLImageElement): Promise<faceapi.FaceDetection | null> {
  try {
    // Ensure models are loaded before detection
    await loadModels();

    // Detect faces using TinyFaceDetector (fast, good for single face detection)
    // inputSize: 416 provides good balance between speed and accuracy
    // scoreThreshold: 0.5 means we only accept detections with >50% confidence
    const detection = await faceapi.detectSingleFace(
      imageElement,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 })
    );

    return detection || null;
  } catch (error) {
    console.error('Error detecting face:', error);
    return null;
  }
}

/**
 * Crop and center an image around a detected face
 * @param imageDataUrl - Base64 data URL of the original image
 * @param detection - Face detection result with bounding box
 * @param padding - Padding factor around face (1.5 = 50% extra space around face)
 * @returns Promise with base64 data URL of the cropped image
 */
export async function cropImageToFace(
  imageDataUrl: string,
  detection: faceapi.FaceDetection,
  padding: number = 1.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create an image element to load the original image
    const img = new Image();

    img.onload = () => {
      // Get face bounding box coordinates
      const box = detection.box;

      // Calculate expanded box with padding
      const faceWidth = box.width;
      const faceHeight = box.height;
      const faceCenterX = box.x + faceWidth / 2;
      const faceCenterY = box.y + faceHeight / 2;

      // Use the larger dimension to create a square crop
      const maxDimension = Math.max(faceWidth, faceHeight);
      const cropSize = maxDimension * padding;

      // Calculate crop box coordinates (ensure within image bounds)
      const cropX = Math.max(0, faceCenterX - cropSize / 2);
      const cropY = Math.max(0, faceCenterY - cropSize / 2);
      const cropWidth = Math.min(cropSize, img.width - cropX);
      const cropHeight = Math.min(cropSize, img.height - cropY);

      // Create canvas for cropping
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Set canvas size to crop size
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // Draw cropped portion of image
      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight,  // Source rectangle
        0, 0, cropWidth, cropHeight            // Destination rectangle
      );

      // Convert canvas to data URL
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      resolve(croppedDataUrl);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for cropping'));
    };

    // Load the image
    img.src = imageDataUrl;
  });
}

/**
 * Process an uploaded image: detect face and crop if found
 * @param imageDataUrl - Base64 data URL of the uploaded image
 * @returns Promise with processed image data URL and detection status
 */
export async function processImageWithFaceDetection(imageDataUrl: string): Promise<{
  processedImage: string;
  faceDetected: boolean;
  detection: faceapi.FaceDetection | null;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = async () => {
      try {
        // Detect face in the image
        const detection = await detectFace(img);

        if (detection) {
          // Face detected - crop to face
          const croppedImage = await cropImageToFace(imageDataUrl, detection);
          resolve({
            processedImage: croppedImage,
            faceDetected: true,
            detection
          });
        } else {
          // No face detected - return original image
          resolve({
            processedImage: imageDataUrl,
            faceDetected: false,
            detection: null
          });
        }
      } catch (error) {
        console.error('Error processing image:', error);
        // If processing fails, return original image
        resolve({
          processedImage: imageDataUrl,
          faceDetected: false,
          detection: null
        });
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageDataUrl;
  });
}
