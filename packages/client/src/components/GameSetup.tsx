import { GameOverview } from '@space/server/src/read/GameOverviews';
import { Avatar, Button, Card, Col, Row, Select, Table } from 'antd';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { createUseStyles } from 'react-jss';
import eventing from '../config/eventing';
import { usePromisedUpdate } from '../hooks';
import ConditionalPopconfirm from './ConditionalPopconfirm';
import GameSettingsForm from './GameSettingsForm';

const useStyles = createUseStyles({
  container: {
    padding: 16,
  },
  row: {
    marginTop: 8,
    marginBottom: 8,
  },
});

export default function GameSetup({
  gameOverview,
}: {
  gameOverview: GameOverview;
}) {
  const classNames = useStyles();

  const [updatingRace, updateRace] = usePromisedUpdate(
    eventing.aggregates.Game(gameOverview.id).selectRace,
  );

  return (
    <div className={classNames.container}>
      <Row gutter={16} className={classNames.row}>
        <Col span={12}>
          <Card
            loading={!gameOverview}
            title={
              <FormattedMessage id="setup.players" defaultMessage="Players" />
            }
          >
            <Table
              rowKey={(record, idx) => record.id || `${idx}`}
              pagination={false}
              dataSource={gameOverview.participants.concat(
                new Array(
                  gameOverview.playerSlots - gameOverview.participants.length,
                ).fill({}),
              )}
              columns={[
                {
                  title: 'Avatar',
                  key: 'avatar',
                  width: '1%',
                  render: (_, record) =>
                    record.color ? (
                      <Avatar
                        icon="user"
                        style={{ backgroundColor: record.color }}
                      />
                    ) : null,
                },
                {
                  title: 'Name',
                  key: 'name',
                  width: '60%',
                  render: (_, record) =>
                    record.name || (
                      <FormattedMessage
                        id="setup.empty"
                        defaultMessage="Empty slot"
                      />
                    ),
                },
                {
                  title: 'Race',
                  key: 'race',
                  width: '39%',
                  render: (_, record) =>
                    eventing.amI(record) ? (
                      <Select<string>
                        style={{ width: '100%' }}
                        placeholder={
                          <FormattedMessage
                            id="setup.noRace"
                            defaultMessage="No race selected"
                          />
                        }
                        loading={updatingRace}
                        disabled={updatingRace}
                        value={record.race && record.race.id}
                        onChange={id => updateRace(id)}
                      >
                        <Select.Option value="human-coalition">
                          Human Coalition
                        </Select.Option>
                        <Select.Option value="replicators">
                          Replicators
                        </Select.Option>
                      </Select>
                    ) : record.name ? (
                      record.race || (
                        <FormattedMessage
                          id="setup.noRace"
                          defaultMessage="No race selected"
                        />
                      )
                    ) : null,
                },
              ]}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <FormattedMessage
                id="setup.settings"
                defaultMessage="Game settings"
              />
            }
          >
            <GameSettingsForm
              gameOverview={gameOverview}
              readOnly={!eventing.amI(gameOverview.owner)}
            />
            <ConditionalPopconfirm
              condition={
                gameOverview.participants.length < gameOverview.playerSlots
              }
              title={
                <FormattedMessage
                  id="setup.startWithEmptySlots"
                  defaultMessage="Some player slots are still empty, start anyways?"
                />
              }
              okText={
                <FormattedMessage id="confirm.yes" defaultMessage="Yes" />
              }
              cancelText={
                <FormattedMessage id="confirm.cancel" defaultMessage="Cancel" />
              }
              onConfirm={() =>
                eventing.aggregates.Game(gameOverview.id).start()
              }
            >
              <Button type="primary">
                <FormattedMessage
                  id="setup.startGame"
                  defaultMessage="Start Game"
                />
              </Button>
            </ConditionalPopconfirm>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
