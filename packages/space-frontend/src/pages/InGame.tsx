import gql from 'graphql-tag';
import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { GalaxyMapQuery, GalaxyMapQueryVariables } from '../api/types';
import { useGraphQLQuery, useStylesheet } from '../hooks';
import { atoms } from '../state';

export function InGamePage() {
  return (
    <>
      INGAME
      <GalaxyMap />
    </>
  );
}

function GalaxyMap() {
  const classNames = useStylesheet({
    map: {
      position: 'relative',
      background: 'black',
      width: '100%',
      height: '80vh',
      overflow: 'auto',
    },
    vision: {
      position: 'absolute',
      pointerEvents: 'none',
      background: 'gray',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
    },
    planet: {
      position: 'absolute',
      background: 'red',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      width: 5,
      height: 5,
    },
  });

  const gameId = useRecoilValue(atoms.gameId)!;

  const {
    data: {
      data: { planets, visions },
    },
  } = useGraphQLQuery<GalaxyMapQuery, GalaxyMapQueryVariables>(
    gql`
      query GalaxyMap($gameId: UUID!) {
        planets(condition: { gameId: $gameId }) {
          nodes {
            id
            name
            owner {
              id
              name
            }
            position {
              x
              y
            }
            class
          }
        }
        visions {
          nodes {
            circle
          }
        }
      }
    `,
    {
      variables: { gameId },
    },
  );

  const boundsX = planets?.nodes.reduce(
    ([min, max], planet) =>
      [
        Math.min(min, planet.position.x),
        Math.max(max, planet.position.x),
      ] as const,
    [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER] as const,
  ) ?? [0, 0];
  const boundsY = planets?.nodes.reduce(
    ([min, max], planet) =>
      [
        Math.min(min, planet.position.y),
        Math.max(max, planet.position.y),
      ] as const,
    [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER] as const,
  ) ?? [0, 0];

  const padding = 20;

  return (
    <div className={classNames.map}>
      {visions?.nodes.map((vision, idx) => {
        const circle = parseCircle(vision.circle);
        if (!circle) {
          return null;
        }
        return (
          <div
            key={idx}
            className={classNames.vision}
            style={{
              left: circle.x - boundsX[0] + padding,
              top: circle.y - boundsY[0] + padding,
              width: circle.radius * 2,
              height: circle.radius * 2,
            }}
          />
        );
      })}
      {planets?.nodes.map((planet) => (
        <div
          key={planet.id}
          title={planet.name}
          className={classNames.planet}
          style={{
            left: planet.position.x - boundsX[0] + padding,
            top: planet.position.y - boundsY[0] + padding,
          }}
        ></div>
      ))}
    </div>
  );
}

function parseCircle(str?: string | null) {
  const result = /^<\((-?[\d.]+),(-?[\d.]+)\),(-?[\d.]+)>$/.exec(str ?? '');

  if (result) {
    return { x: +result[1], y: +result[2], radius: +result[3] };
  }
  return undefined;
}
