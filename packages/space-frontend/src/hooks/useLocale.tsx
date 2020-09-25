import * as React from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { useQuery } from 'react-query';

const LocaleContext = React.createContext<
  [string, React.Dispatch<React.SetStateAction<string>>]
>([navigator.language, () => {}]);

export function useLocale() {
  return React.useContext(LocaleContext);
}

let initial = true;

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const context = React.useState(navigator.language);
  // const context = useRecoilState(localeAtom);
  const { data: messages } = useQuery(
    `messages.${context[0]}`,
    async () =>
      process.env.NODE_ENV === 'production'
        ? fetch(`static/locales/${context[0]}.json`)
        : initial
        ? (initial = false) ||
          new Promise<{}>((resolve) => setTimeout(resolve, 0))
        : new Promise<{}>((resolve) => setTimeout(resolve, 1000)),
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
