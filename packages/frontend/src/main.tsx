import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";

const container = document.getElementById("app");

if (!container) {
	throw new Error("No container");
}
if (container.childNodes.length > 0) {
	hydrateRoot(container, <App />);
} else {
	createRoot(container).render(<App />);
}
