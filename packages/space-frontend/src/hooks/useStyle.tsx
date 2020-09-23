import * as React from 'react';
import { types, TypeStyle } from 'typestyle';

const StyleContext = React.createContext<TypeStyle | null>(null);

export function useStylesheet<
  Classes extends Record<string, types.NestedCSSProperties>
>(classes: Classes) {
  const ts = React.useContext(StyleContext);

  if (!ts) {
    throw new Error('useStylesheet used outside of StyleProvider');
  }

  return ts.stylesheet(classes);
}

export function useKeyframes(keyframes: types.KeyFrames) {
  const ts = React.useContext(StyleContext);

  if (!ts) {
    throw new Error('useStylesheet used outside of StyleProvider');
  }

  return ts.keyframes(keyframes);
}

export function StyleProvider({ children }: { children: React.ReactNode }) {
  const [typestyle] = React.useState(
    () => new TypeStyle({ autoGenerateTag: true }),
  );

  React.useLayoutEffect(() => {
    typestyle.forceRenderStyles();
  }, []);

  return (
    <StyleContext.Provider value={typestyle}>{children}</StyleContext.Provider>
  );
}
