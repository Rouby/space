import { Avatar, Group, Text, UnstyledButton, rem } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useStyles } from "tss-react";
import { vars } from "../../theme";

export function UserButton() {
	const { css } = useStyles();

	return (
		<UnstyledButton
			className={css({
				padding: vars.spacing.md,
				color: vars.colors.dark[0],

				"&:hover": {
					backgroundColor: vars.colors.dark[8],
				},
			})}
		>
			<Group>
				<Avatar
					src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
					radius="xl"
				/>

				<div style={{ flex: 1 }}>
					<Text size="sm" fw={500}>
						Harriette Spoonlicker
					</Text>

					<Text c="dimmed" size="xs">
						hspoonlicker@outlook.com
					</Text>
				</div>

				<IconChevronRight
					className={css({ width: rem(14), height: rem(14) })}
					stroke={1.5}
				/>
			</Group>
		</UnstyledButton>
	);
}
