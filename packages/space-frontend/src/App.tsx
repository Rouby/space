import gql from 'graphql-tag';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { FormattedDisplayName, FormattedMessage, useIntl } from 'react-intl';
import { Route, Routes } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  SignInMutation,
  SignInMutationVariables,
  SignUpMutation,
  SignUpMutationVariables,
} from './api/types';
import { Button, Input, Select } from './components/ui';
import { useGraphQLMutation, useLocale, useNotification } from './hooks';
import { GamesPage, InGamePage } from './pages';
import { atoms, useUser } from './state';

export function App() {
  const user = useUser();

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

  const gameId = useRecoilValue(atoms.gameId);

  const notify = useNotification();

  return (
    <div>
      {user ? (
        <>
          <Button variant="link" to="games">
            <FormattedMessage id="" defaultMessage="Games" />
          </Button>
          <Routes>
            <Route path="games/*" element={<GamesPage />} />
            {gameId && <Route path="*" element={<InGamePage />} />}
          </Routes>
        </>
      ) : (
        <>
          <SignIn />
          <SignUp />
        </>
      )}
      <Select
        useTransition
        options={locales}
        value={locales.find((l) => l.key === locale)}
        onChange={(evt) => evt.target.value && setLocale(evt.target.value.key)}
      />
      <Button
        variant="dashed"
        onClick={() => notify.info({ text: 'oopsi', duration: 0 })}
      >
        Notify
      </Button>
    </div>
  );
}

function SignIn() {
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

function SignUp() {
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
