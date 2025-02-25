import { rem } from "@mantine/core";
import { type LinkProps, Link as RouterLink } from "@tanstack/react-router";
import { forwardRef } from "react";
import { useStyles } from "tss-react";
import { mq, theme, vars } from "../../theme";

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
					paddingInline: vars.spacing.md,
					textDecoration: "none",
					color: vars.colors.white,
					fontWeight: 500,
					fontSize: vars.fontSizes.sm,

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
