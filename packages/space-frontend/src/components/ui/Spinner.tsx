import * as React from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { useKeyframes, useStylesheet } from '../../hooks';

export function Spinner() {
  const classNames = useStylesheet({
    spinning: {
      animationName: useKeyframes({
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
      }),
      animationDuration: '600ms',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'linear',
    },
  });

  return <AiOutlineLoading className={classNames.spinning} />;
}
