import { atom } from 'recoil';

export const gameId = atom<string | null>({ key: 'gameId', default: null });
