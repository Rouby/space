import {
	Alert,
	Badge,
	Card,
	Divider,
	Group,
	Loader,
	Paper,
	Stack,
	Text,
	ThemeIcon,
	Title,
	UnstyledButton,
} from "@mantine/core";
import {
	IconAlien,
	IconArrowRight,
	IconComet,
	IconFlare,
	IconFlareFilled,
	IconGalaxy,
	IconInfoCircle,
	IconMeteor,
	IconPlanet,
	IconRocket,
	IconSatellite,
	IconSparkles,
	IconStar,
	IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import { useClient, useMutation, useQuery } from "urql";
import { graphql } from "../../gql";

const icons = [
	IconRocket,
	IconPlanet,
	IconAlien,
	IconMeteor,
	IconComet,
	IconFlare,
	IconGalaxy,
	IconSatellite,
	IconStar,
	IconUser,
];

export function DilemmaChoice({
	id,
	gameId,
	onChoosen,
}: {
	id: string;
	gameId: string;
	onChoosen: (nextDilemmaId?: string) => void;
}) {
	const client = useClient();

	const [{ data }] = useQuery({
		query: graphql(`
      query DilemmaDetails($id: ID!) {
        dilemma(id: $id) {
          id
          title
          question
          description
          choices {
            id
            title
            description
          }
          choosen
          position
          correlation {
            ... on StarSystem {
              id
              name
            }
            ... on Dilemma {
              id
              title
            }
          }
        }
      }
      `),
		variables: { id },
	});

	const [{ fetching: isChoosing }, chooseDilemmaChoice] = useMutation(
		graphql(`
      mutation MakeDilemmaChoice($id: ID!, $choiceId: ID!) {
        makeDilemmaChoice(dilemmaId: $id, choiceId: $choiceId) {
          id
          title
          choosen
        }
      }
    `),
	);

	const [isWaitingForNext, setIsWaitingForNext] = useState(false);
	const [choosingChoiceId, setChoosingChoiceId] = useState<string>();
	const isBusy = isChoosing || isWaitingForNext;

	const findNextDilemmaId = async () => {
		for (let attempt = 0; attempt < 10; attempt++) {
			const result = await client
				.query(
					graphql(`
						query NextPendingDilemma($gameId: ID!) {
							game(id: $gameId) {
								id
								dilemmas {
									id
									choosen
									causation {
										... on Dilemma {
											id
										}
									}
								}
							}
						}
					`),
					{ gameId },
					{ requestPolicy: "network-only" },
				)
				.toPromise();

			const dilemmas = result.data?.game.dilemmas ?? [];
			const pending = dilemmas.filter((dilemma) => !dilemma.choosen);

			const directFollowUp = pending.find(
				(dilemma) =>
					dilemma.causation?.__typename === "Dilemma" &&
					dilemma.causation.id === id,
			);

			if (directFollowUp) {
				return directFollowUp.id;
			}

			if (pending.length > 0) {
				return pending[0].id;
			}

			await new Promise((resolve) => {
				setTimeout(resolve, 250);
			});
		}

		return undefined;
	};

	const selectedChoiceId = data?.dilemma.choosen;
	const selectedChoice = selectedChoiceId
		? data?.dilemma.choices.find((choice) => choice.id === selectedChoiceId)
		: undefined;
	const isResolved = Boolean(selectedChoiceId);

	if (!data?.dilemma) {
		return (
			<Group justify="center" py="xl">
				<Loader type="dots" />
			</Group>
		);
	}

	return (
		<Stack gap="md">
			<Paper
				p="lg"
				radius="md"
				style={{
					background:
						"linear-gradient(160deg, color-mix(in srgb, var(--mantine-color-indigo-8) 20%, transparent), color-mix(in srgb, var(--mantine-color-cyan-8) 16%, transparent))",
					border:
						"1px solid color-mix(in srgb, var(--mantine-color-cyan-5) 22%, transparent)",
				}}
			>
				<Stack gap="sm">
					<Group justify="space-between" align="flex-start">
						<Stack gap={4}>
							<Group gap="xs">
								<ThemeIcon variant="light" color="cyan">
									<IconSparkles size={16} />
								</ThemeIcon>
								<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
									Strategic Dilemma
								</Text>
							</Group>
							<Title order={2}>{data.dilemma.title}</Title>
						</Stack>
						<Badge color={isResolved ? "teal" : "orange"} variant="light">
							{isResolved ? "Resolved" : "Pending Decision"}
						</Badge>
					</Group>

					<Text style={{ whiteSpace: "pre-line" }}>
						{data.dilemma.description}
					</Text>

					<Divider />

					<Stack gap={4}>
						<Text size="xs" fw={700} tt="uppercase" c="dimmed">
							Question
						</Text>
						<Title order={4}>{data.dilemma.question}</Title>
					</Stack>

					{data.dilemma.correlation?.__typename === "StarSystem" && (
						<Group gap="xs">
							<Badge color="blue" variant="dot">
								Origin: {data.dilemma.correlation.name}
							</Badge>
						</Group>
					)}

					{data.dilemma.correlation?.__typename === "Dilemma" && (
						<Group gap="xs">
							<Badge color="grape" variant="dot">
								Follow-up to: {data.dilemma.correlation.title}
							</Badge>
						</Group>
					)}
				</Stack>
			</Paper>

			{!isResolved && (
				<Alert
					color="yellow"
					variant="light"
					icon={<IconInfoCircle size={16} />}
				>
					You must resolve all pending dilemmas before ending your turn.
				</Alert>
			)}

			{isBusy && (
				<Group gap="xs">
					<Loader size="sm" type="dots" />
					<Text c="dimmed" size="sm">
						Applying your choice and loading the next dilemma...
					</Text>
				</Group>
			)}
			{selectedChoice && (
				<Group>
					<Badge color="teal" variant="light">
						Resolved
					</Badge>
					<Text>
						Chosen option: <strong>{selectedChoice.title}</strong>
					</Text>
				</Group>
			)}
			<Stack gap="xs">
				<Group justify="space-between">
					<Group gap="xs">
						<ThemeIcon variant="light" color="indigo" size="sm">
							<IconFlareFilled size={14} />
						</ThemeIcon>
						<Text size="sm" fw={700}>
							Choose your path
						</Text>
					</Group>
					<Text size="xs" c="dimmed">
						{isResolved ? "Decision locked" : "One choice only"}
					</Text>
				</Group>
				<Group grow align="stretch">
					{data.dilemma.choices.map((choice) => {
						const isSelected = choice.id === selectedChoiceId;
						const isDisabled = Boolean(selectedChoiceId) || isBusy;
						const hash = choice.id
							.split("")
							.reduce((acc, char) => acc + char.charCodeAt(0), 0);
						const index = hash % icons.length;
						const Icon = icons[index];
						return (
							<UnstyledButton
								key={choice.id}
								disabled={isDisabled}
								onClick={() => {
									if (selectedChoiceId || isBusy) {
										return;
									}

									setChoosingChoiceId(choice.id);

									chooseDilemmaChoice({
										id,
										choiceId: choice.id,
									})
										.then(async (result) => {
											if (result.error) {
												return;
											}

											setIsWaitingForNext(true);
											const nextDilemmaId = await findNextDilemmaId();
											onChoosen(nextDilemmaId);
										})
										.finally(() => {
											setIsWaitingForNext(false);
											setChoosingChoiceId(undefined);
										});
								}}
								style={{
									opacity: isDisabled && !isSelected ? 0.55 : 1,
									cursor: isDisabled ? "default" : "pointer",
									width: "100%",
								}}
							>
								<Card
									p="lg"
									radius="md"
									withBorder
									style={{
										height: "100%",
										borderColor: isSelected
											? "var(--mantine-color-teal-5)"
											: "var(--mantine-color-default-border)",
										background: isSelected
											? "linear-gradient(160deg, color-mix(in srgb, var(--mantine-color-teal-8) 18%, transparent), color-mix(in srgb, var(--mantine-color-blue-8) 10%, transparent))"
											: "var(--mantine-color-body)",
									}}
								>
									<Stack gap="sm">
										<Group justify="space-between" align="flex-start">
											<ThemeIcon
												size="xl"
												variant="light"
												color={isSelected ? "teal" : "blue"}
											>
												<Icon size={24} />
											</ThemeIcon>
											{isSelected && (
												<Badge color="teal" variant="filled">
													Selected
												</Badge>
											)}
										</Group>
										<Title order={5}>{choice.title}</Title>
										<Text size="sm" c="dimmed" style={{ lineHeight: 1.4 }}>
											{choice.description}
										</Text>
										<Group justify="space-between" mt="xs">
											<Text size="xs" c="dimmed">
												{isResolved ? "Locked" : "Commit decision"}
											</Text>
											<ThemeIcon
												size="sm"
												variant="subtle"
												color={isSelected ? "teal" : "gray"}
											>
												<IconArrowRight size={12} />
											</ThemeIcon>
										</Group>
										{isBusy && choosingChoiceId === choice.id && (
											<Badge color="blue" variant="light">
												Processing...
											</Badge>
										)}
									</Stack>
								</Card>
							</UnstyledButton>
						);
					})}
				</Group>
			</Stack>
		</Stack>
	);
}
