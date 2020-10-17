import gql from 'graphql-tag';
import * as React from 'react';
import { BiBadge, BiBadgeCheck } from 'react-icons/bi';
import { FormattedMessage } from 'react-intl';
import {
  EndTurnMutation,
  EndTurnMutationVariables,
  TurnEndedSubscription,
  TurnEndedSubscriptionVariables,
} from '../api/types';
import { Button } from '../components/ui';
import { useGraphQLMutation, useGraphQLSubscription } from '../hooks';

export function EndTurnButton() {
  const {
    data: {
      data: { currentPlayer },
    },
  } = useGraphQLSubscription<
    TurnEndedSubscription,
    TurnEndedSubscriptionVariables
  >(
    gql`
      subscription TurnEnded {
        currentPlayer {
          turnEnded
        }
      }
    `,
  );

  const [endTurn] = useGraphQLMutation<
    EndTurnMutation,
    EndTurnMutationVariables
  >(
    gql`
      mutation EndTurn {
        endTurn(input: {}) {
          boolean
        }
      }
    `,
  );

  return (
    <Button
      variant="link"
      disabled={currentPlayer?.turnEnded}
      icon={currentPlayer?.turnEnded ? BiBadgeCheck : BiBadge}
      onClick={() => endTurn()}
    >
      <FormattedMessage id="" defaultMessage="End Turn" />
    </Button>
  );
}
