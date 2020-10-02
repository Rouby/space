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
            position {
              x
              y
            }
            range
          }
        }
      }
    `,
    {
      variables: { gameId },
    },
  );

  return (
    <div className={classNames.map}>
      {visions?.nodes.map((vision, idx) => (
        <div
          key={idx}
          className={classNames.vision}
          style={{
            left: (vision.position?.x ?? 0) + 750,
            top: (vision.position?.y ?? 0) + 700,
            width: (vision.range ?? 0) * 2,
            height: (vision.range ?? 0) * 2,
          }}
        ></div>
      ))}
      {planets?.nodes.map((planet) => (
        <div
          key={planet.id}
          title={planet.name}
          className={classNames.planet}
          style={{
            left: planet.position.x + 750,
            top: planet.position.y + 700,
          }}
        ></div>
      ))}
    </div>
  );
}
