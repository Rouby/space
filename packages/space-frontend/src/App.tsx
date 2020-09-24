import gql from 'graphql-tag';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from './atoms';
import { Button, Input } from './components/ui';
import { useGraphQLMutation } from './hooks';
import { useNotification } from './hooks/useNotification';

export function App() {
  const user = useRecoilValue(userAtom);

  return (
    <div>
      {user ? (
        'LOGGED IN'
      ) : (
        <>
          <SignIn />
          <SignUp />
        </>
      )}
    </div>
  );
}

function SignIn() {
  const [authenticate] = useGraphQLMutation(gql`
    mutation SignIn($email: String!, $password: String!) {
      authenticate(input: { email: $email, password: $password }) {
        jwtToken
      }
    }
  `);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const setUser = useSetRecoilState(userAtom);

  const notify = useNotification();

  return (
    <form autoComplete="off">
      <Input
        type="text"
        name="email"
        ref={register({ required: true })}
        disabled={isSubmitting}
      />
      <Input
        type="password"
        name="password"
        ref={register({ required: true })}
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        variant="primary"
        onClick={handleSubmit((data) =>
          authenticate(data)
            .then(({ authenticate: { jwtToken } }) => {
              if (jwtToken) {
                setUser(jwtToken);
              } else {
                throw new Error('Invalid credentials!');
              }
            })
            .catch((err) => {
              notify.error({
                text: 'Sign-in failed',
                description: err.messageJSX ?? err.message,
              });
            }),
        )}
      >
        Sign In
      </Button>
    </form>
  );
}

function SignUp() {
  const [registerAccount] = useGraphQLMutation(gql`
    mutation SignUp($email: String!, $password: String!) {
      register(input: { name: $email, email: $email, password: $password }) {
        clientMutationId
      }
      authenticate(input: { email: $email, password: $password }) {
        jwtToken
      }
    }
  `);

  const {
    register,
    handleSubmit,
    getValues,
    errors,
    formState: { isSubmitting },
  } = useForm();

  const setUser = useSetRecoilState(userAtom);

  const notify = useNotification();

  return (
    <form name="register" autoComplete="off">
      <Input
        placeholder="Email"
        type="text"
        name="email"
        ref={register({ required: true })}
        disabled={isSubmitting}
        errors={errors}
      />
      <Input
        placeholder="Password"
        type="password"
        name="password"
        ref={register({ required: true })}
        disabled={isSubmitting}
        errors={errors}
      />
      <Input
        placeholder="Password (repeat)"
        type="password"
        name="password2"
        ref={register({
          required: true,
          validate: {
            matchesPreviousPassword: (value) => {
              const { password } = getValues();
              return password === value || 'Passwords should match!';
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
            .then(({ authenticate: { jwtToken } }) => {
              setUser(jwtToken);
            })
            .catch((err) => {
              notify.error({
                text: 'Sign-up failed',
                description: err.messageJSX ?? err.message,
              });
            }),
        )}
      >
        <FormattedMessage defaultMessage="Sign Up" />
      </Button>
    </form>
  );
}
