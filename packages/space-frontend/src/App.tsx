import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useRoutes } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { EndTurnButton, SignInForm } from './components';
import { Button, Layout, Spinner } from './components/ui';
import { GamesPage, InGamePage } from './pages';
import { atoms, useUser } from './state';

export function App() {
  return (
    <Layout>
      <React.Suspense fallback={<AppHeader.Skeleton />}>
        <AppHeader />
      </React.Suspense>
      <React.Suspense fallback={<Spinner />}>
        <AppContent />
      </React.Suspense>
      <React.Suspense fallback={<Spinner />}>
        <AppAvatar />
      </React.Suspense>
    </Layout>
  );
}

function AppHeader() {
  const [user] = useUser();
  const gameId = useRecoilValue(atoms.gameId);

  return user && gameId ? (
    <Layout.Header>
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
    <Layout.Header>
      <Button variant="link" to="games">
        <FormattedMessage id="" defaultMessage="Games" />
      </Button>
    </Layout.Header>
  ) : (
    <Layout.Header>
      <Button variant="link" to="game">
        <FormattedMessage id="" defaultMessage="Game" />
      </Button>
    </Layout.Header>
  );
}
AppHeader.Skeleton = function () {
  return (
    <Layout.Header>
      <Spinner />
    </Layout.Header>
  );
};

function AppContent() {
  const [user] = useUser();
  const gameId = useRecoilValue(atoms.gameId);

  // {/* <Layout.Aside>info panel</Layout.Aside> */}

  const route = useRoutes(
    user && gameId
      ? [{ path: '/*', element: <InGamePage /> }]
      : user
      ? [{ path: '/games/*', element: <GamesPage /> }]
      : [{ path: '/*', element: <SignInForm /> }],
  );

  return (
    <Layout.Content>
      <React.Suspense fallback={<Spinner />}>{route}</React.Suspense>
    </Layout.Content>
  );
}

function AppAvatar() {
  const [user, signOut] = useUser();
  const gameId = useRecoilValue(atoms.gameId);
  const exitGame = useResetRecoilState(atoms.gameId);

  return user ? (
    <Layout.Avatar name={user.name}>
      {gameId && <EndTurnButton />}
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
