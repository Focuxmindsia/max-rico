import "./lib/safeStorage";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import InAppBrowserBanner from "./components/InAppBrowserBanner";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <InAppBrowserBanner />
    <App />
  </ErrorBoundary>
);
