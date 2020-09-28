import gql from 'graphql-tag';
import * as React from 'react';
import { useGraphQLQuery } from '../hooks';

interface GameDetailsProps {}

export function GameDetails({}: GameDetailsProps): React.ReactElement {
  const { data } = useGraphQLQuery(
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
  );

  return <div>{data?.data}</div>;
}
