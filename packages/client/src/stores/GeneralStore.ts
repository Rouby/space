import eventing from '../config/eventing';
import { action, observable, runInAction } from 'mobx';

export default class GeneralStore {
  @observable
  public connected = false;

  @observable
  public authenticated = false;

  @observable
  public gameId = sessionStorage.getItem('space:gameId');

  constructor() {
    eventing.onauthchange = auth => {
      runInAction(() => {
        this.authenticated = auth;
      });
    };
    eventing.onconnectionchange = connected => {
      runInAction(() => {
        this.connected = connected;
      });
    };

    eventing.start();
  }

  @action.bound
  public async authenticate(idToken: string) {
    if (!this.authenticated) {
      await eventing.setUserToken(idToken);
    }
  }

  @action.bound
  public enterGame(gameId: string) {
    this.gameId = gameId;
    sessionStorage.setItem('space:gameId', gameId);
  }
}
