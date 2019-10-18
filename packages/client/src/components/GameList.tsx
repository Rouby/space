import { Button, Popconfirm, Table } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import eventing from '../config/eventing';
import routing from '../config/routing';
import store from '../config/store';
import { useSubscription } from '../hooks';
import CreateGameModal from './CreateGameModal';

export default function GameList() {
  const [pagination, setPagination] = React.useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const games = useSubscription(
    eventing.lists.Games.findAndSubscribe,
    {
      skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 1),
      take: pagination.pageSize,
    },
    [pagination.current, pagination.pageSize],
  );
  const [creatingNewGame, setCreatingNewGame] = React.useState(false);

  return (
    <div>
      <button onClick={() => setCreatingNewGame(true)}>Create Game</button>
      <CreateGameModal
        visible={creatingNewGame}
        onCreate={game => {
          eventing.aggregates
            .Game()
            .create(game.name, game.password, game.playerSlots);
          setCreatingNewGame(false);
        }}
        onCancel={() => setCreatingNewGame(false)}
      />
      <Table
        bordered
        pagination={pagination}
        onChange={pagination => setPagination(pagination)}
        rowKey="id"
        dataSource={games}
        loading={!games}
        columns={[
          {
            title: 'Name',
            key: 'name',
            dataIndex: 'name',
          },
          {
            title: 'Slots',
            key: 'slots',
            render: (_, record) =>
              `${record.participants.length} / ${record.playerSlots}`,
          },
          {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
              <span>
                {record.participants.find(
                  usr => usr.id === (eventing.myself && eventing.myself.id),
                ) ? (
                  <>
                    <Button
                      type="link"
                      onClick={() => {
                        store.general.enterGame(record.id);
                        store.routing.push(routing.overview.link());
                      }}
                    >
                      Enter
                    </Button>
                    {record.owner.id !==
                      (eventing.myself && eventing.myself.id) && (
                      <Popconfirm
                        title={
                          <FormattedMessage
                            id="confirm.leaveGame"
                            defaultMessage="Are you sure you want to leave?"
                          />
                        }
                        okText={
                          <FormattedMessage
                            id="confirm.yes"
                            defaultMessage="Yes"
                          />
                        }
                        cancelText={
                          <FormattedMessage
                            id="confirm.cancel"
                            defaultMessage="Cancel"
                          />
                        }
                        onConfirm={() =>
                          eventing.aggregates.Game(record.id).leave()
                        }
                      >
                        <Button type="link">Leave</Button>
                      </Popconfirm>
                    )}
                  </>
                ) : (
                  <Button
                    type="link"
                    onClick={() => eventing.aggregates.Game(record.id).join()}
                  >
                    Join
                  </Button>
                )}
                {record.owner.id ===
                  (eventing.myself && eventing.myself.id) && (
                  <>
                    <Popconfirm
                      title={
                        <FormattedMessage
                          id="confirm.deleteGame"
                          defaultMessage="Deleting this game is irrevokable, continue?"
                        />
                      }
                      okText={
                        <FormattedMessage id="confirm.ok" defaultMessage="Ok" />
                      }
                      cancelText={
                        <FormattedMessage
                          id="confirm.cancel"
                          defaultMessage="Cancel"
                        />
                      }
                      onConfirm={() =>
                        eventing.aggregates.Game(record.id).delete()
                      }
                    >
                      <Button type="link">Delete</Button>
                    </Popconfirm>
                  </>
                )}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
