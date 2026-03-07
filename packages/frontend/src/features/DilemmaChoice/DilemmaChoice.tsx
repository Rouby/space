import { Group, Stack, Text, Title, UnstyledButton } from "@mantine/core";
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

	return (
		<Stack>
			<Text>{data?.dilemma.description}</Text>
			<Title order={4}>{data?.dilemma.question}</Title>
			<Group grow align="stretch">
				{data?.dilemma.choices.map((choice) => {
					const hash = choice.id
						.split("")
						.reduce((acc, char) => acc + char.charCodeAt(0), 0);
					const index = hash % icons.length;
					const Icon = icons[index];
					return (
						<UnstyledButton
							key={choice.id}
							p="lg"
							onClick={() => {
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
									border: "1px solid var(--mantine-color-gray-4)",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "flex-start",
									gap: "var(--mantine-spacing-xs)",
								},
							}}
						>
							<Icon size="4rem" />
							<Text fw={500}>{choice.title}</Text>
							<Text fw={500}>{choice.description}</Text>
						</UnstyledButton>
					);
				})}
			</Group>
		</Stack>
	);
}
