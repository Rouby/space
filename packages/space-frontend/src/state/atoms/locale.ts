import { atom } from 'recoil';

export const localeAtom = atom({ key: 'locale', default: navigator.language });
