import Debug from 'debug';

const debug = Debug('space');

export const trace = debug.extend('trace');
export const info = debug.extend('info');
export const log = debug;
export const warn = debug.extend('warn');
export const error = debug.extend('error');
