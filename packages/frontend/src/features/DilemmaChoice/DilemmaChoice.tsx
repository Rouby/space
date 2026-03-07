import {
	Badge,
	Group,
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
import { useMutation, useQuery } from "urql";
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
	onChoosen,
}: {
	id: string;
	onChoosen: () => void;
}) {
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

	const [_, chooseDilemmaChoice] = useMutation(
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

	const selectedChoiceId = data?.dilemma.choosen;
	const selectedChoice = selectedChoiceId
		? data?.dilemma.choices.find((choice) => choice.id === selectedChoiceId)
		: undefined;

	return (
		<Stack>
			<Text>{data?.dilemma.description}</Text>
			<Title order={4}>{data?.dilemma.question}</Title>
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
					const isDisabled = Boolean(selectedChoiceId);
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
								if (selectedChoiceId) {
									return;
								}

								chooseDilemmaChoice({
									id,
									choiceId: choice.id,
								}).then(() => {
									onChoosen();
								});
							}}
							styles={{
								root: {
									borderRadius: "var(--mantine-radius-md)",
									border: isSelected
										? "1px solid var(--mantine-color-teal-6)"
										: "1px solid var(--mantine-color-gray-4)",
									background: isSelected
										? "var(--mantine-color-teal-0)"
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
						</UnstyledButton>
					);
				})}
			</Group>
		</Stack>
	);
}
