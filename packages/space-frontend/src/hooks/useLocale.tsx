import * as React from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { useQuery } from 'react-query';

const LocaleContext = React.createContext<
  [string, React.Dispatch<React.SetStateAction<string>>]
>([navigator.language, () => {}]);

export function useLocale() {
  return React.useContext(LocaleContext);
}

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const validLocales = ['en-US'];

  const context = React.useState(
    () =>
      navigator.languages.find((l) => validLocales.includes(l)) ??
      navigator.languages
        .map((l) => l.split('-')[0])
        .find((l) => validLocales.map((o) => o.split('-')[0]).includes(l)) ??
      validLocales[0],
  );
  const { data: messages } = useQuery(
    `messages.${context[0]}`,
    () =>
      fetch(`static/locales/${context[0]}.json`).then((data) =>
        data.ok ? data.json() : {},
      ),
    { staleTime: Infinity },
  );

  return (
    <LocaleContext.Provider value={context}>
      <ReactIntlProvider
        locale={context[0]}
        messages={messages}
        onError={(_err) => {
          // console.warn(err);
        }}
      >
        {children}
      </ReactIntlProvider>
    </LocaleContext.Provider>
  );
}
