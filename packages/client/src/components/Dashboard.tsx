import { Card, Col, List, Row } from 'antd';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { createUseStyles } from 'react-jss';
import eventing from '../config/eventing';
import { useStore, useSubscription } from '../hooks';
import GameSetup from './GameSetup';

const useStyles = createUseStyles({
  container: {
    padding: 16,
  },
  row: {
    marginTop: 8,
    marginBottom: 8,
  },
});

export default function Dashboard() {
  const classNames = useStyles();

  const gameId = useStore(stores => stores.general.gameId);

  const gameOverview = useSubscription(
    eventing.lists.GameOverviews.findOneAndSubscribe,
    gameId ? { where: { id: gameId } } : null,
    [gameId],
  );

  if (!gameOverview) {
    return null;
  }

  if (gameOverview.turn === 0 && eventing.amI(gameOverview.owner)) {
    return <GameSetup gameOverview={gameOverview} />;
  }

  return (
    <div className={classNames.container}>
      <Row gutter={16} className={classNames.row}>
        <Col span={12}>
          <Card
            loading={!gameOverview}
            title={
              <FormattedMessage id="overview.news" defaultMessage="News" />
            }
          >
            <List
              size="small"
              pagination={{
                pageSize: 5,
              }}
              dataSource={gameOverview && gameOverview.recentNews}
              renderItem={item => (
                <List.Item key={item.summary}>
                  <List.Item.Meta
                    title={item.summary}
                    description={
                      <FormattedMessage
                        id="overview.newsHappendOnTurn"
                        defaultMessage="On turn {turn}"
                        values={{ turn: item.onTurn }}
                      />
                    }
                  />
                  {item.text || 'No text'}
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <FormattedMessage id="overview.galaxy" defaultMessage="Galaxy" />
            }
          >
            canvas
          </Card>
        </Col>
      </Row>
      <Row gutter={16} className={classNames.row}>
        <Col span={12}>
          <Card
            title={
              <FormattedMessage id="overview.fleets" defaultMessage="Fleets" />
            }
          >
            ...
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <FormattedMessage
                id="overview.systems"
                defaultMessage="Systems"
              />
            }
          >
            {gameId && <SystemsOverview gameId={gameId} />}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

function SystemsOverview({ gameId }: { gameId: string }) {
  const starSystems = useSubscription(
    eventing.lists.StarSystems.findAndSubscribe,
    { where: { gameId } },
    [gameId],
  );

  if (!starSystems) {
    return null;
  }

  return (
    <>
      {starSystems.map(sys => (
        <div key={sys.id}>{sys.name}</div>
      ))}
    </>
  );
}
