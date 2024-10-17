import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";

dayjs.extend(relativeTime);
dayjs.extend(duration);

const container = document.getElementById("app");

if (!container) {
	throw new Error("No container");
}
if (container.childNodes.length > 0) {
	hydrateRoot(container, <App />);
} else {
	createRoot(container).render(<App />);
}
