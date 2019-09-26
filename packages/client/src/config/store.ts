import { RouterStore } from 'mobx-react-router';
import { IntlStore, GameStore } from '../stores';

export default {
  routing: new RouterStore(),
  intl: new IntlStore('en'),
  game: new GameStore(),
};
