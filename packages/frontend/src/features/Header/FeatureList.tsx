import { Group, Text, ThemeIcon, UnstyledButton, rem } from "@mantine/core";
import { IconClockCog } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useStyles } from "tss-react";
import { theme } from "../../theme";

export function FeatureList() {
	const { css } = useStyles();

	return (
		<UnstyledButton
				component={Link}
				className={css({
					width: "100%",
					padding: `${theme.spacing.xs} ${theme.spacing.md}`,
					borderRadius: theme.radius.md,

					"&:hover": {
						backgroundColor: theme.colors.dark[7],
					},
				})}
				to="/features"
			>
				<Group wrap="nowrap" align="flex-start">
					<ThemeIcon size={34} variant="default" radius="md">
						<IconClockCog
							style={{ width: rem(22), height: rem(22) }}
							color={theme.colors.blue[6]}
						/>
					</ThemeIcon>
					<div>
						<Text size="sm" fw={500}>
							Turn based
						</Text>
						<Text size="xs" c="dimmed">
							Play at your own pace
						</Text>
					</div>
				</Group>
			</UnstyledButton>
	);
}
