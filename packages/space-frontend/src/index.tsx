import * as React from 'react';
import { render } from 'react-dom';
import { App } from './App';

render(<App />, document.getElementById('root'));

console.log((module as any).hot);
