import gql from 'graphql-tag';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { FormattedDisplayName, FormattedMessage, useIntl } from 'react-intl';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  AuthenticateInput,
  AuthenticatePayload,
  RegisterPayload,
} from './api/types';
import { Button, Input, Select } from './components/ui';
import { useGraphQLMutation, useLocale, useNotification } from './hooks';
import { jwtAtom, userAtom } from './state/atoms';

export function App() {
  const user = useRecoilValue(userAtom);

  const [locale, setLocale] = useLocale();
  const locales = ['de', 'en'].map((key) => ({
    key,
    render() {
      return <FormattedDisplayName type="language" value={this.key} />;
    },
    toString() {
      return this.key;
    },
  }));

  return (
    <div>
      {user ? (
        'LOGGED IN'
      ) : (
        <>
          <SignIn />
          <SignUp />
          <Select
            options={locales}
            value={locales.find((l) => l.key === locale)}
            onChange={(evt) =>
              evt.target.value && setLocale(evt.target.value.key)
            }
          />
        </>
      )}
    </div>
  );
}

function SignIn() {
  const setJWT = useSetRecoilState(jwtAtom);

  const notify = useNotification();

  const { formatMessage } = useIntl();

  const [authenticate] = useGraphQLMutation<
    { authenticate?: Pick<AuthenticatePayload, 'jwt'> },
    AuthenticateInput
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
    <form autoComplete="off">
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
              if (data?.authenticate?.jwt) {
                setJWT(data?.authenticate?.jwt);
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

function SignUp() {
  const setJWT = useSetRecoilState(jwtAtom);

  const notify = useNotification();

  const { formatMessage } = useIntl();

  const [registerAccount] = useGraphQLMutation<
    {
      register?: Pick<RegisterPayload, 'clientMutationId'>;
      authenticate?: Pick<AuthenticatePayload, 'jwt'>;
    },
    AuthenticateInput
  >(gql`
    mutation SignUp($email: String!, $password: String!) {
      register(input: { name: $email, email: $email, password: $password }) {
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
  } = useForm<{ email: string; password: string }>();

  return (
    <form name="register" autoComplete="off">
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
        onClick={handleSubmit((data) => {
          console.log(data);
          return registerAccount(data)
            .then((data) => {
              if (data?.authenticate?.jwt) {
                setJWT(data?.authenticate?.jwt);
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
            });
        })}
      >
        <FormattedMessage id="" defaultMessage="Sign Up" />
      </Button>
    </form>
  );
}
