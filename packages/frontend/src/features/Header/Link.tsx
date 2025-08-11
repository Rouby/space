import { rem } from "@mantine/core";
import { type LinkProps, Link as RouterLink } from "@tanstack/react-router";
import { forwardRef } from "react";
import { useStyles } from "tss-react";
import { mq, theme } from "../../theme";

export const Link = forwardRef<
	HTMLAnchorElement,
	LinkProps & { className?: string }
>(function Link(props, ref) {
	const { css, cx } = useStyles();

	return (
		<RouterLink
			ref={ref}
			{...props}
			className={cx(
				css({
					display: "flex",
					alignItems: "center",
					height: "100%",
					paddingInline: theme.spacing.md,
					textDecoration: "none",
					color: theme.white,
					fontWeight: 500,
					fontSize: theme.fontSizes.sm,

					[mq.sm]: {
						height: rem(42),
						width: "100%",
					},

					"&:hover": {
						backgroundColor: theme.colors.dark[6],
					},
				}),
				props.className,
			)}
		/>
	);
});
