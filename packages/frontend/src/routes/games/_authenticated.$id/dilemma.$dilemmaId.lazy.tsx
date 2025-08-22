import {
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
import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { useMutation, useQuery } from "urql";
import { DetailsModal } from "../../../components/DetailsModal/DetailsModal";
import { graphql } from "../../../gql";

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

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/dilemma/$dilemmaId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { dilemmaId } = Route.useParams();
	const navigate = Route.useNavigate();

	const [{ data, fetching }] = useQuery({
		query: graphql(`
			query DilemmaDetails($id: ID!) {
				dilemma(id: $id) {
					id
					title
					description
					choices {
						id
						text
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
		variables: { id: dilemmaId },
	});

	const [_, chooseDilemmaChoice] = useMutation(
		graphql(`
    mutation MakeDilemmaChoice($dilemmaId: ID!, $choiceId: ID!) {
      makeDilemmaChoice(dilemmaId: $dilemmaId, choiceId: $choiceId) {
        id
        title
        choosen
      }
    }
  `),
	);

	return (
		<>
			<DetailsModal
				onClose={() =>
					navigate({
						from: "/games/$id/dilemma/$dilemmaId",
						to: "../..",
					})
				}
				title={<Title order={3}>{data?.dilemma.title}</Title>}
				size="xl"
			>
				{fetching ? (
					<Loader />
				) : (
					<Stack>
						<Text>{data?.dilemma.description}</Text>
						<Title order={4}>Choices</Title>
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
												dilemmaId: dilemmaId,
												choiceId: choice.id,
											}).then(() => {
												navigate({
													from: "/games/$id/dilemma/$dilemmaId",
													to: "../..",
												});
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
										<Text fw={500}>{choice.text}</Text>
									</UnstyledButton>
								);
							})}
						</Group>
					</Stack>
				)}
			</DetailsModal>

			<Outlet />
		</>
	);
}
