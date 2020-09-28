import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { GameList, GameNew } from '../components';
import { GameDetails } from '../components/GameDetails';

export function GamesPage() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <React.Suspense fallback={<GameList.Skeleton />}>
            <GameList />
          </React.Suspense>
        }
      />
      <Route path="new" element={<GameNew />} />
      <Route
        path=":id"
        element={
          <React.Suspense fallback={<GameDetails.Skeleton />}>
            <GameDetails />
          </React.Suspense>
        }
      />
    </Routes>
  );
}
