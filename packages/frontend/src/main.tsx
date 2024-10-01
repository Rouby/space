import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { createRouter } from "./router";

const router = createRouter();

const container = document.getElementById("app");

if (!container) {
	throw new Error("No container");
}
if (container.childNodes.length > 0) {
	hydrateRoot(container, <App router={router} />);
} else {
	createRoot(container).render(<App router={router} />);
}
