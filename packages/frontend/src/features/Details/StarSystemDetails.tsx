import { Button } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { useQuery, useSubscription } from "urql";
import { graphql } from "../../gql";

export function StarSystemDetails({ id }: { id: string }) {
	const [{ data }] = useQuery({
		query: graphql(
			`query StarSystemDetails($id: ID!) {
		starSystem(id: $id) {
			id
			name
			position
			taskForceCommisions {
				id
				progress
				total
			}
			taskForces {
				id
				name
				owner {
					id
					name
				}
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
				Current commisions
				{data?.starSystem.taskForceCommisions.map((commision) => (
					<Suspense key={commision.id} fallback="...">
						<TaskForceCommisionInProgress id={commision.id} />
					</Suspense>
				))}
			</div>
			<div>
				Task forces in this star system
				{data?.starSystem.taskForces.map((taskForce) => (
					<div key={taskForce.id}>
						{taskForce.owner ? `${taskForce.owner.name}'s ` : ""}
						{taskForce.name}
					</div>
				))}
			</div>
			<Button component={Link} to="commision-task-force">
				Commision a task force
			</Button>
		</>
	);
}

function TaskForceCommisionInProgress({ id }: { id: string }) {
	const [{ data }] = useQuery({
		query: graphql(`query TaskForceCommision($id: ID!) {
		taskForceCommision(id: $id) {
			id
			progress
			total
		}
	}`),
		variables: { id },
	});
	useSubscription({
		query: graphql(`subscription TaskForceCommisionSub($id: ID!) {
		taskForceCommisionProgress(id: $id) {
			id
			progress
			total
		}
		}`),
		variables: { id },
	});
	useSubscription({
		query: graphql(`subscription TaskForceCommisionFinishedSub($id: ID!) {
		taskForceCommisionFinished(id: $id) {
			id
			taskForce{
				id
				position
				owner {
					id
					name
				}
			}
		}
		}`),
		variables: { id },
	});

	return (
		<div>
			{data?.taskForceCommision.progress}/{data?.taskForceCommision.total}
		</div>
	);
}
