import {
	ActionIcon,
	Button,
	Group,
	Select,
	Text,
	TextInput,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useMutation, useQuery } from "urql";
import { graphql } from "../../gql";
import { TaskForceShipRole } from "../../gql/graphql";

export function CommisionTaskForce({
	starSystemId,
	gameId,
	onCommision,
}: { starSystemId: string; gameId: string; onCommision: () => void }) {
	const [{ fetching }, commisionTaskForce] = useMutation(
		graphql(`mutation CommisionTaskForce($commision: TaskForceCommisionInput!) {
    createTaskForceCommision(commision: $commision) {
      id
			name
			owner {
				id
				name
				color
			}
			sensorRange
			commisions {
				id
				name
				shipDesign{
					id
					name
				}
				resourceNeeds {
					resource {
						id
						name
					}
					alotted
					needed
				}
			}
    }
  }`),
	);

	const [{ data }] = useQuery({
		query: graphql(`query ShipDesignsForTaskForce($gameId: ID!) {
    game(id: $gameId) {
      id
      me {
        id
        shipDesigns {
          id
          name
        }
      }
    }
  }`),
		variables: { gameId },
	});

	const [ships, setShips] = useState<string[]>([]);

	return (
		<div>
			Commision a task force
			<form
				onSubmit={async (evt) => {
					evt.preventDefault();

					const formData = new FormData(evt.currentTarget as HTMLFormElement);

					const name = formData.get("name") as string;
					const shipNames = formData.getAll("ship.name");
					const shipDesigns = formData.getAll("ship.design");
					const shipRoles = formData.getAll("ship.role");

					const ships = shipNames.map((name, idx) => ({
						name: name as string,
						shipDesignId: shipDesigns[idx] as string,
						role: shipRoles[idx] as TaskForceShipRole,
					}));

					await commisionTaskForce({
						commision: { starSystemId, name, ships },
					});

					onCommision();
				}}
			>
				<TextInput name="name" label="Task force name" required />

				<Text>Ships</Text>

				{ships.map((id) => (
					<Group key={id}>
						<TextInput name="ship.name" label="Ship name" required />
						<Select
							name="ship.design"
							label="Ship design"
							required
							data={data?.game.me?.shipDesigns.map((design) => ({
								label: design.name,
								value: design.id,
							}))}
						/>
						<Select
							name="ship.role"
							label="Ship role"
							required
							data={[
								{ label: "Capital", value: TaskForceShipRole.Capital },
								{ label: "Screen", value: TaskForceShipRole.Screen },
								{ label: "Support", value: TaskForceShipRole.Support },
							]}
						/>
						<ActionIcon
							onClick={() => setShips((s) => s.filter((s) => s !== id))}
							color="red"
						>
							<IconTrash />
						</ActionIcon>
					</Group>
				))}

				<Button onClick={() => setShips((s) => [...s, crypto.randomUUID()])}>
					Add ship to taskforce
				</Button>
				<Button type="submit" loading={fetching}>
					Commision
				</Button>
			</form>
		</div>
	);
}
