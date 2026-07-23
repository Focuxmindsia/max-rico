import "./lib/safeStorage";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import InAppBrowserBanner from "./components/InAppBrowserBanner";

const container = document.getElementById("root")!;
const tree = (
  <ErrorBoundary>
    <InAppBrowserBanner />
    <App />
  </ErrorBoundary>
);

// If the HTML was prerendered with actual body markup (future full-DOM
// prerender), hydrate. Head-only prerender (current mode) leaves #root empty,
// so we fall back to createRoot. This keeps main.tsx forward-compatible.
const prerenderMode = document.documentElement.getAttribute("data-prerendered");
const hasPrerenderedBody =
  prerenderMode === "full" && container.childNodes.length > 0;

if (hasPrerenderedBody) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
