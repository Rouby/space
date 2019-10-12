import { GameOverview } from '@space/server/src/read/GameOverviews';
import { Card, Col, Row, List } from 'antd';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { createUseStyles } from 'react-jss';
import eventing from '../config/eventing';
import { useStore } from '../hooks';

const useStyles = createUseStyles({
  container: {
    padding: 16,
    '& > div': {
      marginTop: 8,
      marginBottom: 8,
    },
  },
});

export default function Dashboard() {
  const classNames = useStyles();

  const gameId = useStore(stores => stores.general.gameId);

  const [gameOverview, setGameOverview] = React.useState<
    GameOverview | undefined
  >(undefined);
  React.useEffect(() => {
    if (gameId) {
      return eventing.lists.GameOverviews.findOneAndSubscribe(
        { where: { id: gameId } },
        data => {
          setGameOverview(data);
        },
      );
    } else {
      setGameOverview(undefined);
      return;
    }
  }, [gameId]);

  return (
    <div className={classNames.container}>
      <Row gutter={16}>
        <Col span={12}>
          <Card
            loading={!gameOverview}
            title={
              <FormattedMessage id="overview.news" defaultMessage="News" />
            }
          >
            <List
              itemLayout="vertical"
              size="small"
              dataSource={gameOverview && gameOverview.recentNews}
              renderItem={item => (
                <List.Item key={item.summary}>
                  <List.Item.Meta
                    title={item.summary}
                    description={item.timestamp}
                  />
                  {item.text}
                </List.Item>
              )}
            ></List>
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
      <Row gutter={16}>
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
            ...
          </Card>
        </Col>
      </Row>
    </div>
  );
}
