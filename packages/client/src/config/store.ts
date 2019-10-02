import { RouterStore } from 'mobx-react-router';
import { IntlStore, GeneralStore } from '../stores';

export default {
  routing: new RouterStore(),
  intl: new IntlStore('en'),
  general: new GeneralStore(),
};
