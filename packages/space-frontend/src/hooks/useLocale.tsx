import * as React from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { useQuery } from 'react-query';

const LocaleContext = React.createContext<{
  locale: string;
  setLocale: React.Dispatch<React.SetStateAction<string>>;
}>({
  locale: navigator.language,
  setLocale: () => {},
});

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState(navigator.language);
  const context = React.useMemo(() => ({ locale, setLocale }), [locale]);
  const { data: messages } = useQuery(`messages.${locale}`, async () =>
    process.env.NODE_ENV === 'production'
      ? fetch(`static/locales/${locale}.json`)
      : {},
  );

  return (
    <LocaleContext.Provider value={context}>
      <ReactIntlProvider
        locale={locale}
        messages={messages}
        onError={(err) => {
          console.warn(err);
        }}
      >
        {children}
      </ReactIntlProvider>
    </LocaleContext.Provider>
  );
}
