import { cssRule } from 'typestyle';
import * as colors from './colors';

export * as colors from './colors';
export * from './units';

cssRule('html, body', {
  width: '100%',
  height: '100%',
  padding: 0,
  margin: 0,
  fontFamily: [
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'Noto Sans',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'Noto Color Emoji',
  ].join(', '),
  color: colors.text.toString(),
});

/** Use border box */
cssRule('html', {
  '-moz-box-sizing': 'border-box',
  '-webkit-box-sizing': 'border-box',
  boxSizing: 'border-box',
});

cssRule('*,*:before,*:after', {
  boxSizing: 'inherit',
});

cssRule('#root', {
  width: '100%',
  height: '100%',
});
