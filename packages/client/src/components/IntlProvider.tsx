import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { useStore } from '../hooks';

export default function IntlProvider_({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useStore(store => store.intl.locale);
  const messages = useStore(store => store.intl.messages);

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
}
