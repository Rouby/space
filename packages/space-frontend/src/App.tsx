import * as React from 'react';

export function App() {
  const [state, setState] = React.useState(0);

  return (
    <div onClick={() => setState((s) => s + 1)}>Hello {state} ppeps asd</div>
  );
}
