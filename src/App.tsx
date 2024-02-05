import { createTheme, MantineProvider, Text } from '@mantine/core';
import '@mantine/core/styles.css';
import { useState } from 'react';

const theme = createTheme({
  /** Put your mantine theme override here */
});

export function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <h1>Vite + React</h1>
        <Text c="var(--mantine-color-grape-6)">asd</Text>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </MantineProvider>
    </>
  );
}
