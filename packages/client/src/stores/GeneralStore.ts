import eventing from '../config/eventing';
import { action, observable, runInAction } from 'mobx';

export default class GeneralStore {
  @observable
  public authenticated = false;

  constructor() {
    eventing.onauthchange = auth => {
      runInAction(() => {
        this.authenticated = auth;
      });
    };

    eventing.start();
  }

  @action.bound
  public async authenticate(idToken: string) {
    await eventing.setUserToken(idToken);
  }
}
