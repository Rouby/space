import { createBrowserHistory } from 'history';
import { syncHistoryWithStore } from 'mobx-react-router';
import store from './store';

const browserHistory = createBrowserHistory();

export default syncHistoryWithStore(browserHistory, store.routing);
