import gql from 'graphql-tag';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { AiFillAndroid } from 'react-icons/ai';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from './atoms';
import { Button } from './components/ui';
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

  const [loading, setLoading] = React.useState<Promise<void>>();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        registerAccount(data)
          .then(({ authenticate: { jwtToken } }) => {
            setUser(jwtToken);
          })
          .catch(
            ({ errors }: { errors: { errcode: string; detail: string }[] }) => {
              notify.error({
                text: 'Sign-up failed',
                description: errors.map((err) => (
                  <div key={err.detail}>
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
      <Button type="submit">sign-up</Button>
      <Button variant="primary" type="submit">
        sign-up
      </Button>
      <Button variant="dashed" type="submit">
        sign-up
      </Button>
      <Button variant="text" type="submit">
        sign-up
      </Button>
      <Button variant="link" type="submit">
        sign-up
      </Button>
      <Button icon={AiFillAndroid} variant="link" type="submit">
        sign-up
      </Button>
      <Button
        variant="primary"
        onClick={() => {
          setLoading(new Promise((res) => setTimeout(res, 2500)));
        }}
        loading={loading}
      >
        sign-up
      </Button>
    </form>
  );
}
