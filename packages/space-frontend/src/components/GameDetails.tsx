import gql from 'graphql-tag';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import {
  GalaxySize,
  GalaxyType,
  GameDetailsSubscription,
  GameDetailsSubscriptionVariables,
  GamePlayerListQuery,
  GamePlayerListQueryVariables,
  RacesQuery,
  RacesQueryVariables,
  StartGameMutation,
  StartGameMutationVariables,
  UpdateGameMutation,
  UpdateGameMutationVariables,
} from '../api/types';
import {
  useGraphQLMutation,
  useGraphQLQuery,
  useGraphQLSubscription,
} from '../hooks';
import { atoms, useUser } from '../state';
import { Button, Input, Select } from './ui';

interface GameDetailsProps {}

export function GameDetails({}: GameDetailsProps): React.ReactElement {
  const { id } = useParams();

  const {
    data: {
      data: { game },
    },
  } = useGraphQLSubscription<
    GameDetailsSubscription,
    GameDetailsSubscriptionVariables
  >(
    gql`
      subscription GameDetails($id: UUID!) {
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

  const [updateGame] = useGraphQLMutation<
    UpdateGameMutation,
    UpdateGameMutationVariables
  >(
    gql`
      mutation UpdateGame($id: UUID!, $patch: GamePatch!) {
        updateGame(input: { id: $id, patch: $patch }) {
          clientMutationId
        }
      }
    `,
  );

  const setCurrentGame = useSetRecoilState(atoms.gameId);

  const [startGame] = useGraphQLMutation<
    StartGameMutation,
    StartGameMutationVariables
  >(
    gql`
      mutation StartGame($id: UUID!) {
        startGame(input: { gameId: $id }) {
          game {
            started
          }
        }
      }
    `,
  );

  const navigate = useNavigate();

  const user = useUser();

  const isAuthor = user?.id === game?.author?.id;
  const hasStarted = !!game?.started;

  return (
    <div>
      {isAuthor && !hasStarted ? (
        <>
          <Input
            defaultValue={game?.name}
            onChange={({ target: { value } }) => {
              updateGame({ id: game!.id, patch: { name: value } });
            }}
          />
          <Select
            defaultValue={game?.type}
            options={Object.values(GalaxyType)}
            onChange={({ target: { value } }) => {
              updateGame({ id: game!.id, patch: { type: value } });
            }}
          />
          <Select
            defaultValue={game?.size}
            options={Object.values(GalaxySize)}
            onChange={({ target: { value } }) => {
              updateGame({ id: game!.id, patch: { size: value } });
            }}
          />
        </>
      ) : (
        <>
          <div>Name: {game?.name}</div>
          <div>Type: {game?.type}</div>
          <div>Size: {game?.size}</div>
        </>
      )}
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
          <PlayerList gameId={game?.id} gameHasStarted={hasStarted} />
        </React.Suspense>
      )}
      {isAuthor && !hasStarted && (
        <Button variant="primary" onClick={() => startGame({ id: game!.id })}>
          <FormattedMessage id="" defaultMessage="Start game" />
        </Button>
      )}
      {hasStarted && (
        <Button
          variant="primary"
          onClick={() => {
            setCurrentGame(game!.id);
            navigate('/');
          }}
        >
          <FormattedMessage id="" defaultMessage="Open game" />
        </Button>
      )}
    </div>
  );
}

GameDetails.Skeleton = function GameDetailsSkeleton() {
  return <div>Loading...</div>;
};

interface PlayerListProps {
  gameId: string;
  gameHasStarted: boolean;
}

function PlayerList({ gameId, gameHasStarted }: PlayerListProps) {
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
              {!gameHasStarted ? (
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
              ) : (
                <>({player.race?.name})</>
              )}
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
