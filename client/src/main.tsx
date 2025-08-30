import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add global error handlers to prevent unhandled rejections
window.addEventListener('unhandledrejection', (event) => {
  // Check if this is a Vite HMR fetch error
  if (event.reason && 
      (event.reason.message?.includes('Failed to fetch') || 
       event.reason.toString().includes('Failed to fetch') ||
       event.reason.name === 'TypeError')) {
    // Silently suppress Vite HMR errors
    event.preventDefault();
    return;
  }
  
  // Log other actual errors for debugging
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  // Check if this is a fetch error
  if (event.error && 
      (event.error.message?.includes('Failed to fetch') ||
       event.error.toString().includes('Failed to fetch'))) {
    // Silently suppress fetch errors
    event.preventDefault();
    return;
  }
  
  console.error('Global error:', event.error);
  event.preventDefault();
});

createRoot(document.getElementById("root")!).render(<App />);
