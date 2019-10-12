import { GameOverview } from '@space/server/src/read/GameOverviews';
import { Card, Col, Row, List } from 'antd';
import * as React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { createUseStyles } from 'react-jss';
import eventing from '../config/eventing';
import { useStore } from '../hooks';
import { DateTime } from 'luxon';

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
