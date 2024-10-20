import { Application, extend } from "@pixi/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Container, Graphics } from "pixi.js";
import "pixi.js/math-extras";
import { useCallback, useRef, useState } from "react";
import { useStyles } from "tss-react";
import { useMutation, useQuery, useSubscription } from "urql";
import { useAuth } from "../../Auth";
import { graphql } from "../../gql";
import { Sensors } from "./Sensors";
import { StarSystem } from "./StarSystem";
import { TaskForce } from "./TaskForce";
import { Viewport, ViewportWrapper } from "./Viewport";

extend({
	Container,
	Graphics,
	Viewport,
});

export function GalaxyView() {
	const { id } = useParams({ from: "/games/_authenticated/$id" });

	const { me } = useAuth();

	const [{ data }] = useQuery({
		query: graphql(`
query Galaxy($id: ID!) {
  game(id: $id) {
    id
		starSystems {
			id
			position
			owner {
				id
				name
				color
			}
			isVisible
			lastUpdate
			sensorRange
		}
		taskForces {
			id
			name
			position
			owner {
				id
				name
				color
			}
			orders {
				id
				...on TaskForceMoveOrder {
					destination
				}
			}
			movementVector
			isVisible
			lastUpdate
			sensorRange
		}
  }
}`),
		variables: { id },
	});

	const [, moveTaskForce] = useMutation(
		graphql(`mutation MoveTaskForce($id: ID!, $position: Vector!, $queueOrder: Boolean!) {
		moveTaskForce(id: $id, position: $position) @skip(if: $queueOrder) {
			id
			orders {
				id
				...on TaskForceMoveOrder {
					destination
				}
			}
		}
		
		queueTaskForceMove(id: $id, position: $position) @include(if: $queueOrder) {
			id
			orders {
				id
				...on TaskForceMoveOrder {
					destination
				}
			}
		}
	}`),
	);

	useSubscription({
		query: graphql(`subscription TrackMap($gameId: ID!) {
		trackGalaxy(gameId: $gameId) {
		  ... on PositionableApppearsEvent {
				subject {
					__typename
					id
					position
					... on TaskForce {
						isVisible
						lastUpdate
						movementVector
					}
					... on StarSystem {
						isVisible
						lastUpdate
					}
				}
			}
		  ... on PositionableMovesEvent {
				subject {
					__typename
					id
					position
					... on TaskForce {
						movementVector
					}
				}
			}
		  ... on PositionableDisappearsEvent {
				subject {
					__typename
					id
					position
					... on TaskForce {
						isVisible
						lastUpdate
					}
					... on StarSystem {
						isVisible
						lastUpdate
					}
				}
			}
		}
	}`),
		variables: { gameId: id },
	});

	const { css } = useStyles();

	const parentRef = useRef<HTMLDivElement>(null);

	const navigate = useNavigate();

	const onClickStarSystem = useCallback(
		(id: string) => {
			navigate({
				from: "/games/$id",
				to: "star-system/$starSystemId",
				params: { starSystemId: id },
			});
		},
		[navigate],
	);

	const [selectedTaskForce, setSelectedTaskForce] = useState<string>();
	const onClickTaskForce = useCallback((id: string) => {
		setSelectedTaskForce(id);
	}, []);

	return (
		<div ref={parentRef} className={css({ overflow: "hidden" })}>
			<Application
				attachToDevTools={!import.meta.env.PROD}
				resizeTo={parentRef}
			>
				<container>
					<ViewportWrapper
						onRightClick={(d) => {
							if (selectedTaskForce) {
								moveTaskForce({
									id: selectedTaskForce,
									position: d.point,
									queueOrder: d.shift,
								});
							}
						}}
					>
						<Sensors
							sensors={[
								...(data?.game.starSystems.filter(
									(s) =>
										typeof s.sensorRange === "number" &&
										s.sensorRange > 0 &&
										s.isVisible,
								) ?? []),
								...(data?.game.taskForces.filter(
									(s) =>
										typeof s.sensorRange === "number" &&
										s.sensorRange > 0 &&
										s.isVisible,
								) ?? []),
							]}
						/>
						{data?.game.starSystems.map((starSystem) => (
							<StarSystem
								key={starSystem.id}
								id={starSystem.id}
								position={starSystem.position}
								isVisible={starSystem.isVisible}
								ownerColor={starSystem.owner?.color}
								onClick={onClickStarSystem}
								sensorRange={starSystem.sensorRange}
							/>
						))}
						{data?.game.taskForces.map((taskForce) => (
							<TaskForce
								key={taskForce.id}
								id={taskForce.id}
								position={taskForce.position}
								isVisible={taskForce.isVisible}
								isSelected={taskForce.id === selectedTaskForce}
								ownerColor={taskForce.owner?.color}
								onClick={onClickTaskForce}
								sensorRange={taskForce.sensorRange}
							/>
						))}
					</ViewportWrapper>
				</container>
			</Application>
		</div>
	);
}
