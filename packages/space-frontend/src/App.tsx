import gql from 'graphql-tag';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { FormattedDisplayName, FormattedMessage, useIntl } from 'react-intl';
import { Route, Routes } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import {
  SignInMutation,
  SignInMutationVariables,
  SignUpMutation,
  SignUpMutationVariables,
} from './api/types';
import { Button, Input, Layout, Select } from './components/ui';
import { useGraphQLMutation, useLocale, useNotification } from './hooks';
import { GamesPage } from './pages';
import { atoms, useUser } from './state';

export function App() {
  return (
    <Layout>
      <React.Suspense fallback={<AppHeader.Skeleton />}>
        <AppHeader />
      </React.Suspense>
      <React.Suspense fallback={null}>
        <AppContent />
      </React.Suspense>
      <React.Suspense fallback={null}>
        <AppAvatar />
      </React.Suspense>
    </Layout>
  );
}

function AppHeader() {
  const [user] = useUser();
  const gameId = useRecoilValue(atoms.gameId);

  return user && gameId ? (
    <Layout.Header key="ingame">
      <div>Resource 1</div>
      <div>Resource 2</div>
      <div>Resource 3</div>
      <div>Resource 4</div>
      <div>Resource 5</div>
      <div>Resource 6</div>
      <div>Resource 7</div>
      <div>Resource 8</div>
      <div>Resource 9</div>
      <div>Resource 10</div>
      <div>Resource 11</div>
      <div>Resource 12</div>
      <div>Resource 13</div>
      <div>Resource 14</div>
      <div>Resource 15</div>
      <div>Resource 16</div>
    </Layout.Header>
  ) : user ? (
    <Layout.Header key="outgame">
      <Button variant="link" to="games">
        <FormattedMessage id="" defaultMessage="Games" />
      </Button>
    </Layout.Header>
  ) : (
    <Layout.Header key="navigation">
      <Button variant="link" to="game">
        <FormattedMessage id="" defaultMessage="Game" />
      </Button>
    </Layout.Header>
  );
}
AppHeader.Skeleton = function () {
  return <Layout.Header>Loading...</Layout.Header>;
};

function AppContent() {
  const [user] = useUser();

  // {/* <Layout.Aside>info panel</Layout.Aside> */}

  return (
    <Layout.Content>
      <React.Suspense fallback="Loading...">
        <Routes>
          {user ? (
            <>
              <Route path="/games/*" element={<GamesPage />} />
            </>
          ) : (
            <>
              <Route path="/*" element={<SignIn />} />
            </>
          )}
        </Routes>
      </React.Suspense>
    </Layout.Content>
  );
}

function AppAvatar() {
  const [user, signOut] = useUser();
  const gameId = useRecoilValue(atoms.gameId);
  const exitGame = useResetRecoilState(atoms.gameId);

  return user ? (
    <Layout.Avatar name={user.name}>
      {gameId && (
        <Button variant="link" onClick={exitGame}>
          <FormattedMessage id="" defaultMessage="Exit Game" />
        </Button>
      )}
      <Button variant="link" onClick={signOut}>
        <FormattedMessage id="" defaultMessage="Sign Out" />
      </Button>
    </Layout.Avatar>
  ) : null;
}

function LocaleSelect() {
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
    <Select
      useTransition
      options={locales}
      value={locales.find((l) => l.key === locale)}
      onChange={(evt) => evt.target.value && setLocale(evt.target.value.key)}
    />
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
