import { atom, selector } from 'recoil';

export const jwtAtom = atom<string | null>({
  key: 'jwt',
  default: null,
});

export const userAtom = selector({
  key: 'user',
  get: ({ get }) => {
    const jwt = get(jwtAtom);
    return jwt ? {} : null;
  },
});
