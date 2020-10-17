import gql from 'graphql-tag';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSetRecoilState } from 'recoil';
import { SignUpMutation, SignUpMutationVariables } from '../api/types';
import { useGraphQLMutation, useNotification } from '../hooks';
import { atoms } from '../state';
import { Button, Input } from './ui';

export function SignUpForm() {
  const setJWT = useSetRecoilState(atoms.jwt);

  const notify = useNotification();

  const { formatMessage } = useIntl();

  const [registerAccount] = useGraphQLMutation<
    SignUpMutation,
    SignUpMutationVariables
  >(gql`
    mutation SignUp($name: String!, $email: String!, $password: String!) {
      register(input: { name: $name, email: $email, password: $password }) {
        clientMutationId
      }
      authenticate(input: { email: $email, password: $password }) {
        jwt
      }
    }
  `);

  const {
    register,
    handleSubmit,
    getValues,
    errors,
    formState: { isSubmitting },
  } = useForm<{ name: string; email: string; password: string }>();

  return (
    <form name="sign-up" autoComplete="off">
      <Input
        placeholder={formatMessage({ defaultMessage: 'Name' })}
        type="text"
        name="name"
        ref={register({ required: true })}
        disabled={isSubmitting}
        errors={errors}
      />
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
      <Input
        placeholder={formatMessage({ defaultMessage: 'Password (repeat)' })}
        type="password"
        name="password2"
        ref={register({
          required: true,
          validate: {
            matchesPreviousPassword: (value) => {
              const { password } = getValues();
              return (
                password === value ||
                formatMessage({ defaultMessage: 'Passwords should match' })
              );
            },
          },
        })}
        disabled={isSubmitting}
        errors={errors}
      />
      <Button
        type="submit"
        variant="primary"
        onClick={handleSubmit((data) =>
          registerAccount(data)
            .then((data) => {
              if (data?.data?.authenticate?.jwt) {
                setJWT(data?.data?.authenticate?.jwt);
              } else {
                throw new Error(
                  formatMessage({
                    defaultMessage: 'Unexpected authentication error',
                  }),
                );
              }
            })
            .catch((err) => {
              notify.error({
                text: formatMessage({ defaultMessage: 'Sign Up failed' }),
                description: err.messageJSX ?? err.message,
              });
            }),
        )}
      >
        <FormattedMessage id="" defaultMessage="Sign Up" />
      </Button>
    </form>
  );
}
