import gql from 'graphql-tag';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from './atoms';
import { useGraphQLMutation } from './hooks';
import { useNotification } from './hooks/useNotification';

export function App() {
  const user = useRecoilValue(userAtom);

  const notify = useNotification();

  return (
    <div>
      {user ? (
        'LOGGED IN'
      ) : (
        <>
          <SignIn />
          <SignUp />
          <button
            onClick={() =>
              notify.success({
                text: 'Notification',
              })
            }
          >
            NOTIFY
          </button>
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

  const { register, handleSubmit } = useForm();

  const setUser = useSetRecoilState(userAtom);

  const notify = useNotification();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        authenticate(data)
          .then(({ authenticate: { jwtToken } }) => {
            setUser(jwtToken);
          })
          .catch((err) => {
            notify.error({
              text: 'Sign-up failed',
              description: err.toString(),
            });
          });
      })}
    >
      <input type="text" name="email" ref={register} />
      <input type="password" name="password" ref={register} />
      <button type="submit">sign-in</button>
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

  const { register, handleSubmit } = useForm();

  const setUser = useSetRecoilState(userAtom);

  const notify = useNotification();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        registerAccount(data)
          .then(({ authenticate: { jwtToken } }) => {
            setUser(jwtToken);
          })
          .catch(
            ({
              response: { errors },
            }: {
              response: { errors: { errcode: string; detail: string }[] };
            }) => {
              notify.error({
                text: 'Sign-up failed',
                description: errors.map((err) => (
                  <div>
                    {err.errcode}: {err.detail}
                  </div>
                )),
              });
            },
          );
      })}
    >
      <input type="text" name="email" ref={register} />
      <input type="password" name="password" ref={register} />
      <button type="submit">sign-up</button>
    </form>
  );
}
