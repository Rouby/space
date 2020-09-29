import { atom, selector } from 'recoil';

export const jwt = atom<string | null>({
  key: 'jwt',
  default: null,
});

export const user = selector({
  key: 'user',
  get: ({ get }) => {
    const value = get(jwt);
    return value ? {} : null;
  },
});
