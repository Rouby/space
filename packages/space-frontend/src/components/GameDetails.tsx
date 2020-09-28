import gql from 'graphql-tag';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import {
  GameDetailsQuery,
  GameDetailsQueryVariables,
  GamePlayerListQuery,
  GamePlayerListQueryVariables,
  RacesQuery,
  RacesQueryVariables,
} from '../api/types';
import { useGraphQLQuery } from '../hooks';
import { useUser } from '../state';
import { Select } from './ui';

interface GameDetailsProps {}

export function GameDetails({}: GameDetailsProps): React.ReactElement {
  const { id } = useParams();

  const {
    data: {
      data: { game },
    },
  } = useGraphQLQuery<GameDetailsQuery, GameDetailsQueryVariables>(
    gql`
      query GameDetails($id: UUID!) {
        game(id: $id) {
          id
          name
          type
          size
          started
          playerSlots
          players {
            totalCount
          }
          author {
            id
            name
          }
        }
      }
    `,
    {
      variables: {
        id,
      },
    },
  );

  return (
    <div>
      Name: {game?.name}
      <br />
      <FormattedMessage
        id=""
        defaultMessage="{playerCount} of {playerTotal} players"
        values={{
          playerCount: game?.players.totalCount,
          playerTotal: game?.playerSlots,
        }}
      />
      {game && (
        <React.Suspense fallback={<PlayerList.Skeleton />}>
          <PlayerList gameId={game?.id} />
        </React.Suspense>
      )}
    </div>
  );
}

GameDetails.Skeleton = function GameDetailsSkeleton() {
  return <div>Loading...</div>;
};

interface PlayerListProps {
  gameId: string;
}

function PlayerList({ gameId }: PlayerListProps) {
  const {
    data: {
      data: { players },
    },
  } = useGraphQLQuery<GamePlayerListQuery, GamePlayerListQueryVariables>(
    gql`
      query GamePlayerList($id: UUID!) {
        players(condition: { gameId: $id }) {
          nodes {
            person {
              id
              name
            }
            race {
              id
              name
            }
          }
        }
      }
    `,
    {
      variables: {
        id: gameId,
      },
    },
  );

  const {
    data: {
      data: { races },
    },
  } = useGraphQLQuery<RacesQuery, RacesQueryVariables>(gql`
    query Races {
      races {
        nodes {
          id
          name
        }
      }
    }
  `);

  const user = useUser();

  return (
    <ol>
      {players?.nodes.map((player) => (
        <li key={player.person?.id}>
          {player.person?.id === user?.id ? (
            <>
              You{' '}
              <Select
                value={(
                  races?.nodes.map((race) => ({
                    id: race.id,
                    toString() {
                      return race.name;
                    },
                  })) ?? []
                ).find((race) => race.id === player.race?.id)}
                onChange={(v) => console.log(v)}
                options={
                  races?.nodes.map((race) => ({
                    id: race.id,
                    toString() {
                      return race.name;
                    },
                  })) ?? []
                }
              />
            </>
          ) : (
            <>
              {player.person?.name} ({player.race?.name})
            </>
          )}
        </li>
      ))}
    </ol>
  );
}

PlayerList.Skeleton = function PlayerListSkeleton() {
  return <div>Loading...</div>;
};
