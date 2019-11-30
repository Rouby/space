import {
  Alert,
  Col,
  Divider,
  Drawer,
  Icon,
  Row,
  Statistic,
  Timeline,
  Typography,
} from 'antd';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { createUseStyles } from 'react-jss';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { Link } from '../components';
import routing, { CanGoBackToCloseDrawer } from '../config/routing';
import { usePathMatch, useStore } from '../hooks';
import { uncertainToString } from '../utils';

const useStyles = createUseStyles({
  event: {
    marginLeft: '0.5em',
  },
  statRow: {
    margin: {
      bottom: 8,
    },
  },
});

export default function SystemOverview({
  match,
}: RouteComponentProps<{ id: string }>) {
  const classNames = useStyles();

  const closeDrawer = useStore(
    store =>
      store.routing.location.state === CanGoBackToCloseDrawer
        ? () => store.routing.goBack()
        : () =>
            store.routing.replace(
              routing.galaxy.sidebars.system.link({
                id: match.params.id,
              }),
            ),
    [match.params.id],
  );

  const drawerOpen = usePathMatch(
    Object.values(routing.galaxy.sidebars).flatMap(
      route => route.sidebarPathnames,
    ),
  );

  const intl = useIntl();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const system = {} as any;

  return (
    <>
      <Row className={classNames.statRow}>
        <Col span={12}>
          <Statistic
            title="Population"
            value={uncertainToString(system.population, intl, {
              maximumFractionDigits: 3,
            })}
            valueStyle={{
              color: system.populationTrend === 'rise' ? '#3f8600' : '#cf1322',
            }}
            prefix={<Icon type={system.populationTrend || 'fall'} />}
            suffix="billion"
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="GDP"
            value={uncertainToString(system.gdp, intl)}
            valueStyle={{
              color: system.gdpTrend === 'rise' ? '#3f8600' : '#cf1322',
            }}
            prefix={<Icon type={system.gdpTrend || 'fall'} />}
            suffix="thousand"
          />
        </Col>
      </Row>
      <Row className={classNames.statRow}>
        <Col span={12}>
          <Statistic title="Ground forces" value={'??'} suffix="armies" />
        </Col>
        <Col span={12}>
          <Statistic title="Space forces" value={'??'} suffix="fleets" />
        </Col>
      </Row>
      <Alert
        message="Warning"
        description="An enemy fleet is approaching this system. ETA Turn-2177"
        type="warning"
        showIcon
      />
      <Divider orientation="left">Recent events</Divider>
      <Timeline reverse>
        <Timeline.Item>
          <Typography>
            <Typography.Text disabled>Turn-2173</Typography.Text>
            <Typography.Text strong className={classNames.event}>
              Building complete
            </Typography.Text>
          </Typography>
        </Timeline.Item>
        <Timeline.Item>
          <Typography>
            <Typography.Text disabled>Turn-2175</Typography.Text>
            <Typography.Text strong className={classNames.event}>
              Army recruited
            </Typography.Text>
          </Typography>
        </Timeline.Item>
        <Timeline.Item>
          <Typography>
            <Typography.Text disabled>Turn-2176</Typography.Text>
            <Typography.Text strong className={classNames.event}>
              Ships build
            </Typography.Text>
          </Typography>
        </Timeline.Item>
      </Timeline>
      <Link
        to={routing.galaxy.sidebars.system.sidebars.build.link(
          {
            id: match.params.id,
          },
          CanGoBackToCloseDrawer,
        )}
      >
        Build
      </Link>
      <Drawer
        title={
          <Switch>
            <Route
              path={routing.galaxy.sidebars.system.sidebars.build.pathname}
              render={() => 'Build'}
            />
          </Switch>
        }
        visible={!!drawerOpen}
        onClose={closeDrawer}
        width={380}
        destroyOnClose
      >
        <Switch>
          <Route
            path={routing.galaxy.sidebars.system.sidebars.build.pathname}
            render={() => 'Build'}
          />
        </Switch>
      </Drawer>
    </>
  );
}
