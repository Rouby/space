import { action, observable } from 'mobx';

export default class GameStore {
  @observable
  public turnEnded = false;

  @action.bound
  public toggleEndTurn() {
    this.turnEnded = !this.turnEnded;
  }
}
