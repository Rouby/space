import { MessageFormatElement } from 'intl-messageformat-parser';
import { autorun, observable, computed } from 'mobx';

type Translations = {
  [key: string]:
    | Record<string, string>
    | Record<string, MessageFormatElement[]>;
};

export default class IntlStore {
  @observable
  public locale = '';

  @computed
  get messages() {
    return this.translations[this.locale];
  }

  @observable
  private translations: Translations = {};

  constructor(defaultLocale: string) {
    if (typeof Storage !== 'undefined') {
      this.locale = localStorage.getItem('locale') || defaultLocale;
    } else {
      this.locale = defaultLocale;
    }

    autorun(async () => {
      try {
        const response = await fetch(`/static/messages/${this.locale}.json`);
        if (response.ok) {
          const messages = await response.json();
          this.translations[this.locale] = messages;
        }
      } catch (err) {
        console.log(err);
      }
    });
  }
}
