import type { Viewport } from "./Viewport";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			viewport: PixiReactNode<typeof Viewport>;
		}
	}
}
