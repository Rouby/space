import * as React from 'react';
import eventing from '../config/eventing';
import { useStore, useSubscription } from '../hooks';
import { createUseStyles } from 'react-jss';
import Link from './Link';
import routing from '../config/routing';

const useStyles = createUseStyles({
  container: {
    background: 'black',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  system: {
    position: 'absolute',
    width: 24,
    height: 24,
    background: 'yellow',
  },
});

export default function GalaxyView() {
  const classNames = useStyles();

  const gameId = useStore(stores => stores.general.gameId);

  const starSystems = useSubscription(
    eventing.lists.StarSystems.findAndSubscribe,
    gameId ? { where: { gameId } } : { where: { gameId: 'never' } },
    [gameId],
  );

  if (!gameId) {
    return null;
  }

  return (
    <div className={classNames.container}>
      {starSystems &&
        starSystems.map(system => (
          <Link
            key={system.id}
            className={classNames.system}
            style={{
              left: system.position.x + 500,
              top: system.position.y + 500,
            }}
            to={routing.galaxy.sidebars.system.link(system)}
          >
            system
          </Link>
        ))}
    </div>
  );
}
