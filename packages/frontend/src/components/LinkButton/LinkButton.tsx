import { Button } from "@mantine/core";
import type { LinkProps } from "@tanstack/react-router";
import { createLink } from "@tanstack/react-router";
import { forwardRef } from "react";

export const LinkButton = createLink(
	forwardRef<HTMLAnchorElement, LinkProps>(function Link(
		{ children, ...props },
		ref,
	) {
		return (
			<Button ref={ref} component="a" {...props}>
				{typeof children === "function"
					? children({ isActive: false, isTransitioning: false })
					: children}
			</Button>
		);
	}),
);
