import {
	Badge,
	Card,
	Group,
	SimpleGrid,
	Table,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { IconCheck, IconHourglass, IconListDetails } from "@tabler/icons-react";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "urql";
import { LinkButton } from "../../components/LinkButton/LinkButton";
import { graphql } from "../../gql";

export function DilemmasList() {
	const { id: gameId } = useParams({ from: "/games/_authenticated/$id" });

	const [{ data }] = useQuery({
		query: graphql(`
			query DilemmasHistoryList($gameId: ID!) {
				game(id: $gameId) {
					id
					dilemmas {
						id
						title
						question
						choosen
						choices {
							id
							title
						}
					}
				}
			}
		`),
		variables: { gameId },
	});

	const dilemmas = [...(data?.game?.dilemmas ?? [])].sort((a, b) => {
		const aResolved = Boolean(a.choosen);
		const bResolved = Boolean(b.choosen);

		if (aResolved === bResolved) {
			return a.title.localeCompare(b.title);
		}

		return aResolved ? 1 : -1;
	});

	const pendingCount = dilemmas.filter((dilemma) => !dilemma.choosen).length;
	const resolvedCount = dilemmas.length - pendingCount;

	return (
		<Group align="stretch" grow style={{ flexDirection: "column" }}>
			<SimpleGrid cols={{ base: 1, sm: 3 }}>
				<Card withBorder radius="md" p="md">
					<Group justify="space-between">
						<StackedLabel
							title="Total Dilemmas"
							value={String(dilemmas.length)}
						/>
						<ThemeIcon variant="light" color="indigo">
							<IconListDetails size={16} />
						</ThemeIcon>
					</Group>
				</Card>
				<Card withBorder radius="md" p="md">
					<Group justify="space-between">
						<StackedLabel title="Pending" value={String(pendingCount)} />
						<ThemeIcon variant="light" color="orange">
							<IconHourglass size={16} />
						</ThemeIcon>
					</Group>
				</Card>
				<Card withBorder radius="md" p="md">
					<Group justify="space-between">
						<StackedLabel title="Resolved" value={String(resolvedCount)} />
						<ThemeIcon variant="light" color="teal">
							<IconCheck size={16} />
						</ThemeIcon>
					</Group>
				</Card>
			</SimpleGrid>

			<Table striped highlightOnHover withTableBorder withColumnBorders>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Title</Table.Th>
						<Table.Th>Question</Table.Th>
						<Table.Th>Status</Table.Th>
						<Table.Th>Choice</Table.Th>
						<Table.Th />
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{dilemmas.map((dilemma) => {
						const selectedChoice = dilemma.choosen
							? dilemma.choices.find((choice) => choice.id === dilemma.choosen)
							: undefined;

						return (
							<Table.Tr key={dilemma.id}>
								<Table.Td>
									<Title order={6}>{dilemma.title}</Title>
								</Table.Td>
								<Table.Td>
									<Text size="sm" c="dimmed">
										{dilemma.question}
									</Text>
								</Table.Td>
								<Table.Td>
									<Badge
										color={selectedChoice ? "teal" : "orange"}
										variant="light"
									>
										{selectedChoice ? "Resolved" : "Pending"}
									</Badge>
								</Table.Td>
								<Table.Td>
									{selectedChoice ? (
										<Text>{selectedChoice.title}</Text>
									) : (
										<Text c="dimmed">Awaiting decision</Text>
									)}
								</Table.Td>
								<Table.Td>
									<LinkButton
										to="/games/$id/dilemmas/$dilemmaId"
										params={{ id: gameId, dilemmaId: dilemma.id }}
									>
										{selectedChoice ? "Review" : "Decide"}
									</LinkButton>
								</Table.Td>
							</Table.Tr>
						);
					})}
				</Table.Tbody>
			</Table>
		</Group>
	);
}

function StackedLabel({ title, value }: { title: string; value: string }) {
	return (
		<Group
			style={{
				flexDirection: "column",
				alignItems: "flex-start",
				gap: 2,
			}}
		>
			<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
				{title}
			</Text>
			<Text fw={700} size="xl">
				{value}
			</Text>
		</Group>
	);
}
