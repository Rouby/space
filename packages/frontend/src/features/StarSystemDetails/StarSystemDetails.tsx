import { Button } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useQuery } from "urql";
import { graphql } from "../../gql";

export function StarSystemDetails({ id }: { id: string }) {
	const [{ data }] = useQuery({
		query: graphql(
			`query StarSystemDetails($id: ID!) {
		starSystem(id: $id) {
			id
			name
			position
			taskForces {
				id
				name
				owner {
					id
					name
				}
			}
			discoveries {
				... on ResourceDiscovery {
					id
					resource {
						id
						name
					}
					remainingDeposits
				}
			}
			resourceDepots {
				id
				resource {
					id
					name
				}	
				quantity
			}
		}
	}`,
		),
		variables: { id },
	});

	return (
		<>
			details about this star systm {data?.starSystem.name}
			<div>
				Task forces in this star system
				{data?.starSystem.taskForces.map((taskForce) => (
					<div key={taskForce.id}>
						{taskForce.owner ? `${taskForce.owner.name}'s ` : ""}
						{taskForce.name}
					</div>
				))}
			</div>
			<div>
				discoveries
				{data?.starSystem.discoveries.map((discovery) => (
					<div key={discovery.id}>
						{discovery.resource.name} -{" "}
						{new Intl.NumberFormat(undefined, {
							maximumFractionDigits: 0,
						}).format(discovery.remainingDeposits)}{" "}
						units left
					</div>
				))}
			</div>
			<div>
				depots
				{data?.starSystem.resourceDepots.map((discovery) => (
					<div key={discovery.id}>
						{discovery.resource.name} -{" "}
						{new Intl.NumberFormat(undefined, {
							maximumFractionDigits: 0,
						}).format(discovery.quantity)}{" "}
						units stored
					</div>
				))}
			</div>
			<Button
				component={Link}
				from="/games/$id/star-system/$starSystemId"
				to="commision-task-force"
			>
				Commision a task force
			</Button>
		</>
	);
}
