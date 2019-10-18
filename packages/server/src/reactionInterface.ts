import { ReactionInterface } from '@eventing/core';
import { ClientWrites } from './write';

export type ReactionInterface = ReactionInterface<
  {
    [P in keyof ClientWrites]: (
      id?: string,
    ) => {
      [O in keyof ClientWrites[P]]: ClientWrites[P][O];
    };
  }
>;
