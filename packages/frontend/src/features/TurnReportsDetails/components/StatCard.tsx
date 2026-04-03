import { Card, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import type { ReactNode } from "react";

type StatCardProps = {
	title: string;
	value: string;
	detail: string;
	color: string;
	icon: ReactNode;
};

export function StatCard({ title, value, detail, color, icon }: StatCardProps) {
	return (
		<Card withBorder radius="md" p="sm">
			<Stack gap={6}>
				<Group justify="space-between" align="center">
					<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
						{title}
					</Text>
					<ThemeIcon color={color} variant="light" size="sm" radius="sm">
						{icon}
					</ThemeIcon>
				</Group>
				<Text fw={700} size="lg">
					{value}
				</Text>
				<Text size="xs" c="dimmed">
					{detail}
				</Text>
			</Stack>
		</Card>
	);
}
