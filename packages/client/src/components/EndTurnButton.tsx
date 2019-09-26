import * as React from 'react';
import { Button } from 'antd';
import { useIntl } from 'react-intl';
import { useStore } from '../hooks';

export interface EndTurnButtonProps {
  className?: string;
}

export default function EndTurnButton({ className }: EndTurnButtonProps) {
  const turnEnded = useStore(store => store.game.turnEnded);
  const toggleEndTurn = useStore(store => store.game.toggleEndTurn);

  const intl = useIntl();

  return (
    <Button
      type="primary"
      size="large"
      className={className}
      shape="round"
      icon={turnEnded ? 'check-circle' : 'clock-circle'}
      onClick={toggleEndTurn}
    >
      {turnEnded
        ? intl.formatMessage({
            id: 'button.turnEnded',
            defaultMessage: 'Waiting...',
          })
        : intl.formatMessage({
            id: 'button.endTurn',
            defaultMessage: 'End Turn',
          })}
    </Button>
  );
}
