import {
	Badge,
	Group,
	Loader,
	Stack,
	Text,
	Title,
	UnstyledButton,
} from "@mantine/core";
import {
	IconAlien,
	IconComet,
	IconFlare,
	IconGalaxy,
	IconMeteor,
	IconPlanet,
	IconRocket,
	IconSatellite,
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

	return (
		<Stack>
			<Text>{data?.dilemma.description}</Text>
			<Title order={4}>{data?.dilemma.question}</Title>
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
			<Group grow align="stretch">
				{data?.dilemma.choices.map((choice) => {
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
							p="lg"
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
							styles={{
								root: {
									borderRadius: "var(--mantine-radius-md)",
									border: isSelected
										? "1px solid var(--mantine-color-teal-5)"
										: "1px solid var(--mantine-color-default-border)",
									background: isSelected
										? "color-mix(in srgb, var(--mantine-color-teal-7) 16%, transparent)"
										: undefined,
									boxShadow: isSelected
										? "inset 0 0 0 1px color-mix(in srgb, var(--mantine-color-teal-5) 65%, transparent)"
										: undefined,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "flex-start",
									gap: "var(--mantine-spacing-xs)",
									opacity: isDisabled && !isSelected ? 0.5 : 1,
									cursor: isDisabled ? "default" : "pointer",
								},
							}}
						>
							<Icon size="4rem" />
							<Text fw={500}>{choice.title}</Text>
							<Text fw={500}>{choice.description}</Text>
							{isSelected && (
								<Badge color="teal" variant="filled">
									Selected
								</Badge>
							)}
							{isBusy && choosingChoiceId === choice.id && (
								<Badge color="blue" variant="light">
									Processing...
								</Badge>
							)}
						</UnstyledButton>
					);
				})}
			</Group>
		</Stack>
	);
}
