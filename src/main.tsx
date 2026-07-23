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

const prerenderMode = document.documentElement.getAttribute("data-prerendered");
const hasPrerenderedBody =
  prerenderMode === "full" && container.childNodes.length > 0;

if (hasPrerenderedBody) {
  // Silence recoverable hydration mismatches (Radix generated IDs, dates,
  // etc.). React will re-render the affected subtree on the client — this
  // keeps prerender/hydration robust to minor server/client divergence.
  hydrateRoot(container, tree, {
    onRecoverableError: (error) => {
      if (import.meta.env.DEV) console.warn("[hydrate recoverable]", error);
    },
  });
} else {
  createRoot(container).render(tree);
}
