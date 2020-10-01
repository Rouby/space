import gql from 'graphql-tag';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQueryCache } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { CreateGameMutation, CreateGameMutationVariables } from '../api/types';
import { useGraphQLMutation, useNotification } from '../hooks';
import { Button, Input } from './ui';

interface GameNewProps {}

export function GameNew({}: GameNewProps) {
  const notify = useNotification();

  const { formatMessage } = useIntl();

  const navigate = useNavigate();

  const queryCache = useQueryCache();

  const [createGame] = useGraphQLMutation<
    CreateGameMutation,
    CreateGameMutationVariables
  >(gql`
    mutation CreateGame($name: String!) {
      createGame(input: { name: $name }) {
        game {
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
    }
  `);

  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting },
  } = useForm<{ name: string }>();

  return (
    <form name="new-game">
      <Input
        placeholder={formatMessage({ defaultMessage: 'Game name' })}
        type="text"
        name="name"
        ref={register({ required: true })}
        disabled={isSubmitting}
        errors={errors}
      />
      <Button
        type="submit"
        variant="primary"
        loading={isSubmitting}
        onClick={handleSubmit((data) =>
          createGame(data)
            .then((data) => {
              if (data?.data?.createGame?.game?.id) {
                queryCache.invalidateQueries(
                  (p) => p.queryKey[0] === 'GameList',
                );
                queryCache.setQueryData(
                  [
                    'GameDetails',
                    { variables: { id: data?.data?.createGame?.game?.id } },
                  ],
                  { data: { game: data?.data?.createGame?.game } },
                );
                navigate(`/games/${data?.data?.createGame?.game?.id}`);
              } else {
                throw new Error(
                  formatMessage({
                    defaultMessage: 'Unexpected error',
                  }),
                );
              }
            })
            .catch((err) => {
              notify.error({
                text: formatMessage({
                  defaultMessage: 'Could not create game',
                }),
                description: err.messageJSX ?? err.message,
              });
            }),
        )}
      >
        <FormattedMessage id="" defaultMessage="Create game" />
      </Button>
    </form>
  );
}
