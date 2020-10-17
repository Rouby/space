import * as React from 'react';
import { FormattedDisplayName } from 'react-intl';
import { useLocale } from '../hooks';
import { Select } from './ui';

export function LocaleSelect() {
  const [locale, setLocale] = useLocale();
  const locales = ['de', 'en'].map((key) => ({
    key,
    render() {
      return <FormattedDisplayName type="language" value={this.key} />;
    },
    toString() {
      return this.key;
    },
  }));

  return (
    <Select
      useTransition
      options={locales}
      value={locales.find((l) => l.key === locale)}
      onChange={(evt) => evt.target.value && setLocale(evt.target.value.key)}
    />
  );
}
