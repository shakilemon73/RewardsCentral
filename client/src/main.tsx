import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add global error handlers to prevent unhandled rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent the default behavior which logs to console
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  event.preventDefault();
});

createRoot(document.getElementById("root")!).render(<App />);
