import gql from 'graphql-tag';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSetRecoilState } from 'recoil';
import { SignInMutation, SignInMutationVariables } from '../api/types';
import { useGraphQLMutation, useNotification } from '../hooks';
import { atoms } from '../state';
import { Button, Input } from './ui';

export function SignInForm() {
  const setJWT = useSetRecoilState(atoms.jwt);

  const notify = useNotification();

  const { formatMessage } = useIntl();

  const [authenticate] = useGraphQLMutation<
    SignInMutation,
    SignInMutationVariables
  >(gql`
    mutation SignIn($email: String!, $password: String!) {
      authenticate(input: { email: $email, password: $password }) {
        jwt
      }
    }
  `);

  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting },
  } = useForm<{ email: string; password: string }>();

  return (
    <form name="sign-in" autoComplete="off">
      <Input
        placeholder={formatMessage({ defaultMessage: 'Email' })}
        type="text"
        name="email"
        ref={register({ required: true })}
        disabled={isSubmitting}
        errors={errors}
      />
      <Input
        placeholder={formatMessage({ defaultMessage: 'Password' })}
        type="password"
        name="password"
        ref={register({ required: true })}
        disabled={isSubmitting}
        errors={errors}
      />
      <Button
        type="submit"
        variant="primary"
        onClick={handleSubmit((data) =>
          authenticate(data)
            .then((data) => {
              if (data?.data?.authenticate?.jwt) {
                setJWT(data?.data.authenticate?.jwt);
              } else {
                throw new Error(
                  formatMessage({ defaultMessage: 'Invalid credentials' }),
                );
              }
            })
            .catch((err) => {
              notify.error({
                text: formatMessage({ defaultMessage: 'Sign In failed' }),
                description: err.messageJSX ?? err.message,
              });
            }),
        )}
      >
        <FormattedMessage id="" defaultMessage="Sign In" />
      </Button>
    </form>
  );
}
