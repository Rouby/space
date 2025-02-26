import { Avatar, Group, Text, UnstyledButton, rem } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useStyles } from "tss-react";
import { useQuery } from "urql";
import { useAuth } from "../../Auth";
import { graphql } from "../../gql";
import { vars } from "../../theme";

export function UserButton() {
	const { css } = useStyles();
	const { me: currentUser } = useAuth();

	const [{ data }] = useQuery({
		query: graphql(`
			query CurrentUser {
				me {
					name
					email
				}
			}
		`),
		pause: !currentUser?.id,
	});

	if (!data?.me) {
		return null;
	}

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
						{data.me.name}
					</Text>

					<Text c="dimmed" size="xs">
						{data.me.email}
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
