// Import React's StrictMode component for highlighting potential problems in the application
import { StrictMode } from 'react';
// Import the createRoot function from ReactDOM for creating a root to render React components
import { createRoot } from 'react-dom/client';
// Import the main App component
import App from './App.tsx';
// Import global CSS styles (including Tailwind CSS directives)
import './index.css';

// Create a React root at the element with id 'root' and render the App component
// The non-null assertion (!) is used because we know the root element exists in index.html
createRoot(document.getElementById('root')!).render(
  // StrictMode wraps the app to enable additional development checks and warnings
  <StrictMode>
    <App />
  </StrictMode>
);
