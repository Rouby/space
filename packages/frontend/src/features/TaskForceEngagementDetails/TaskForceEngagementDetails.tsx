import { Progress, Text } from "@mantine/core";
import { Application } from "@pixi/react";
import { Graphics, type Application as PixiApp, Point } from "pixi.js";
import { useEffect, useRef } from "react";
import { useClient, useQuery } from "urql";
import { graphql } from "../../gql";

export function TaskForceEngagementDetails({ id }: { id: string }) {
	const [{ data }] = useQuery({
		query: graphql(`
      query TaskForceEngagementDetails($id: ID!) {
        taskForceEngagement(id: $id) {
          id
          phase
          phaseProgress
          taskForces {
            id
            name
            ships {
              id
              name
              structuralIntegrity
              role
              shipDesign {
                id
                name
              }
              components {
                id
                component {
                  id
                  name
                }
                state
              }
            }
          }
        }
      }`),
		variables: { id },
	});

	const app = useRef<PixiApp>(null);

	const client = useClient();
	useEffect(() => {
		const { unsubscribe } = client
			.subscription(
				graphql(`
      subscription WeaponEffects($id: ID!) {
        trackTaskForceEngagement(taskForceEngagementId: $id) {
          __typename
          ... on TaskForceEngagementWeaponFiredEvent {
            attacker {
              id
            }
            target {
              id
            }
            weapon {
              id
              component {
                id
                name
              }
            }
            damage
          }
        }
      }
    `),
				{ id },
			)
			.subscribe((value) => {
				if (
					value.data?.trackTaskForceEngagement.__typename ===
					"TaskForceEngagementWeaponFiredEvent"
				) {
					const { attacker, target, damage, weapon } =
						value.data.trackTaskForceEngagement;

					console.log({ attacker, target, damage, weapon });

					const attackerTaskForceIdx =
						data?.taskForceEngagement.taskForces.findIndex((tf) =>
							tf.ships.some((s) => s.id === attacker.id),
						) ?? 0;
					const attackerIdx =
						data?.taskForceEngagement.taskForces
							.at(attackerTaskForceIdx)
							?.ships.findIndex((s) => s.id === attacker.id) ?? 0;

					const targetTaskForceIdx =
						data?.taskForceEngagement.taskForces.findIndex((tf) =>
							tf.ships.some((s) => s.id === target.id),
						) ?? 0;
					const targetIdx =
						data?.taskForceEngagement.taskForces
							.at(targetTaskForceIdx)
							?.ships.findIndex((s) => s.id === target.id) ?? 0;

					const bullet = new Graphics();
					bullet.setFillStyle({
						color: attackerTaskForceIdx === 0 ? "yellow" : "hotpink",
					});
					bullet.circle(0, 0, 5);
					bullet.fill();
					bullet.x = attackerTaskForceIdx === 0 ? 50 : 750;
					bullet.y = 50 + 50 * attackerIdx;

					const targetVector = new Point(
						targetTaskForceIdx === 0 ? 50 : 750,
						50 + 50 * targetIdx,
					)
						.subtract(bullet.position)
						.normalize();

					app.current?.stage.addChild(bullet);
					app.current?.ticker.add(moveBullet);

					function moveBullet() {
						bullet.position = bullet.position.add(
							targetVector.multiplyScalar(1),
						);

						if (bullet.x > 750 || bullet.x < 50) {
							app.current?.ticker.remove(moveBullet);
							app.current?.stage.removeChild(bullet);
						}
					}
				}
			});

		return () => unsubscribe();
	});

	return (
		<>
			<Text>Current Phase: {data?.taskForceEngagement.phase}</Text>
			<Progress
				value={(data?.taskForceEngagement.phaseProgress ?? 0) * 100}
				w={200}
			/>
			<Application
				ref={app}
				attachToDevTools={!import.meta.env.PROD}
				antialias
				autoDensity
				width={800}
				height={600}
			>
				{data?.taskForceEngagement.taskForces.at(0)?.ships.map((ship, idx) => (
					<graphics
						key={ship.id}
						position={{ x: 50, y: 50 + idx * 50 }}
						draw={(graphics) => {
							graphics.clear();
							graphics.setFillStyle({ color: "green" });
							graphics.circle(0, 0, 15);
							graphics.fill();
						}}
					/>
				))}
				{data?.taskForceEngagement.taskForces.at(1)?.ships.map((ship, idx) => (
					<graphics
						key={ship.id}
						position={{ x: 750, y: 50 + idx * 50 }}
						draw={(graphics) => {
							graphics.clear();
							graphics.setFillStyle({ color: "red" });
							graphics.circle(0, 0, 15);
							graphics.fill();
						}}
					/>
				))}
			</Application>
		</>
	);
}
