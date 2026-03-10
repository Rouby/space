import {
	DEFAULT_THEME,
	type MantineBreakpointsValues,
	createTheme,
	mergeMantineTheme,
} from "@mantine/core";

export const themeOverride = createTheme({});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);

/** Theme media query helper for use in TSS syntax
 * @returns
 * ```
 * {
 *  xs: '@media (max-width: 36em)',
 *  sm: '@media (max-width: 48em)',
 *  md: '@media (max-width: 62em)',
 *  lg: '@media (max-width: 75em)',
 *  xl: '@media (max-width: 88em)'
 * }
 * ```
 * Use in TSS css syntax like this:
 * ```
 *  [`${mq.sm}`]: {
 *    margin: 12px
 *  }
 * \`\`\`
 */
export const mq = Object.keys(theme.breakpoints).reduce(
	(acc, mantineSize) => {
		acc[mantineSize] = `@media (max-width: ${theme.breakpoints[mantineSize]})`;
		return acc;
	},
	{} as Record<keyof MantineBreakpointsValues, string>,
);
