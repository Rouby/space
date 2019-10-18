import { ReactionInterface } from '@eventing/core';
import { ServerWrites } from './write';

export type ReactionInterface = ReactionInterface<
  {
    [P in keyof ServerWrites]: (
      id?: string,
    ) => {
      [O in keyof ServerWrites[P]]: ServerWrites[P][O];
    };
  }
>;
