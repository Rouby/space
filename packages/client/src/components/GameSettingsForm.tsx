import { GameOverview } from '@space/server/src/read/GameOverviews';
import { Form, Radio, Switch } from 'antd';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import eventing from '../config/eventing';
import { usePromisedUpdate } from '../hooks';
import GalaxyPreview from './GalaxyPreview';
import { GalaxyType, GalaxySize } from '@space/types';

export default function GameSettingsForm({
  gameOverview,
  readOnly,
}: {
  gameOverview: GameOverview;
  readOnly: boolean;
}) {
  const [updatingType, updateType] = usePromisedUpdate(
    eventing.aggregates.Game(gameOverview.id).selectGalaxyType,
  );
  const [updatingSize, updateSize] = usePromisedUpdate(
    eventing.aggregates.Game(gameOverview.id).selectGalaxySize,
  );
  const [updatingWormholes, updateWormholes] = usePromisedUpdate(
    eventing.aggregates.Game(gameOverview.id).toggleWormholes,
  );
  const [updatingFogOfWar, updateFogOfWar] = usePromisedUpdate(
    eventing.aggregates.Game(gameOverview.id).toggleFogOfWar,
  );

  return (
    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
      <fieldset>
        <legend>
          <FormattedMessage id="setup.galaxy" defaultMessage="Galaxy" />
        </legend>
        <Form.Item
          label={<FormattedMessage id="setup.shape" defaultMessage="Shape" />}
        >
          <Radio.Group
            disabled={readOnly || updatingType}
            value={gameOverview.galaxyType}
            onChange={e => updateType(e.target.value)}
          >
            <Radio value={GalaxyType.Elliptical}>
              <FormattedMessage
                id="setup.galaxyType.Elliptical"
                defaultMessage="Elliptical"
              />
            </Radio>
            <Radio value={GalaxyType.Irregular}>
              <FormattedMessage
                id="setup.galaxyType.Irregular"
                defaultMessage="Irregular"
              />
            </Radio>
            <Radio value={GalaxyType.Spiral}>
              <FormattedMessage
                id="setup.galaxyType.Spiral"
                defaultMessage="Spiral"
              />
            </Radio>
            <Radio value={GalaxyType.BarredSpiral}>
              <FormattedMessage
                id="setup.galaxyType.BarredSpiral"
                defaultMessage="Barred Spiral"
              />
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="setup.size" defaultMessage="Size" />}
        >
          <Radio.Group
            disabled={readOnly || updatingSize}
            value={gameOverview.galaxySize}
            onChange={e => updateSize(e.target.value)}
          >
            <Radio value={GalaxySize.Small}>
              <FormattedMessage
                id="setup.galaxySize.small"
                defaultMessage="Small"
              />
            </Radio>
            <Radio value={GalaxySize.Medium}>
              <FormattedMessage
                id="setup.galaxySize.medium"
                defaultMessage="Medium"
              />
            </Radio>
            <Radio value={GalaxySize.Large}>
              <FormattedMessage
                id="setup.galaxySize.large"
                defaultMessage="Large"
              />
            </Radio>
          </Radio.Group>
        </Form.Item>
        <GalaxyPreview
          type={gameOverview.galaxyType}
          size={gameOverview.galaxySize}
        />
      </fieldset>
      <fieldset>
        <legend>Difficulty</legend>
        <Form.Item
          label={
            <FormattedMessage id="setup.wormholes" defaultMessage="Wormholes" />
          }
        >
          <Switch
            disabled={readOnly || updatingWormholes}
            checked={gameOverview.wormholes}
            onChange={e => updateWormholes(e)}
          />
        </Form.Item>
        <Form.Item
          label={
            <FormattedMessage id="setup.fogOfWar" defaultMessage="Fog of war" />
          }
        >
          <Switch
            disabled={readOnly || updatingFogOfWar}
            checked={gameOverview.fogOfWar}
            onChange={e => updateFogOfWar(e)}
          />
        </Form.Item>
      </fieldset>
    </Form>
  );
}
