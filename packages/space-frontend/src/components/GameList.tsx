import gql from 'graphql-tag';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { GameListQuery, GameListQueryVariables } from '../api/types';
import { useGraphQLQuery } from '../hooks';
import { Button } from './ui';

interface GameListProps {}

export function GameList({}: GameListProps): React.ReactElement {
  const {
    data: {
      data: { games },
    },
  } = useGraphQLQuery<GameListQuery, GameListQueryVariables>(
    gql`
      query GameList($cursor: Cursor) {
        games(orderBy: [NATURAL], after: $cursor, first: 10) {
          edges {
            cursor
            node {
              id
              name
              author {
                id
                name
              }
              playerSlots
              players {
                totalCount
              }
              started
            }
          }
          totalCount
        }
      }
    `,
    {
      variables: {
        cursor: null,
      },
    },
  );

  const navigate = useNavigate();

  const gameCount = games?.edges.length ?? 0;
  const gameTotal = games?.totalCount ?? 0;

  return (
    <div>
      <FormattedMessage
        id=""
        defaultMessage={`Showing
{gameCount, plural,
  =0 {no games}
  one {# game}
  other {# games}
}
{moreGamesThanShown, select,
  yes { out of {gameTotal} total games}
  no {}
}`}
        values={{
          gameCount,
          gameTotal,
          moreGamesThanShown: gameCount < gameTotal ? 'yes' : 'no',
        }}
      />
      {games?.edges.map((edge) => (
        <div key={edge.node.id}>
          {edge.node.name}
          <FormattedMessage
            id=""
            defaultMessage="{playerCount} of {playerTotal} players"
            values={{
              playerCount: edge.node.players.totalCount,
              playerTotal: edge.node.playerSlots,
            }}
          />
          {edge.node.started ? 'started? YES' : 'started? NO'}
          <Button variant="link" onClick={() => navigate(edge.node.id)}>
            <FormattedMessage id="" defaultMessage="Details" />
          </Button>
        </div>
      ))}
      <Button
        variant="primary"
        onClick={() => {
          navigate('new');
        }}
      >
        <FormattedMessage id="" defaultMessage="Create a game" />
      </Button>
    </div>
  );
}

GameList.Skeleton = function () {
  return <div>Loading games...</div>;
};
