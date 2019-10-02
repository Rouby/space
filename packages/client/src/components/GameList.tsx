import * as React from 'react';
import { Game } from '@space/server/src/read/Games';
import eventing from '../config/eventing';
import { Table, Modal, Input, Form, Switch } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { PaginationConfig } from 'antd/lib/table';

interface CreateGameFormProps extends FormComponentProps<Game> {
  visible: boolean;
  onCreate: (game: Game) => void;
  onCancel: () => void;
}
const CreateGameForm = Form.create<CreateGameFormProps>()(
  function CreateGameForm({
    visible,
    onCreate,
    onCancel,
    form: {
      getFieldValue,
      getFieldDecorator,
      validateFieldsAndScroll,
      resetFields,
    },
  }: CreateGameFormProps) {
    return (
      <Modal
        visible={visible}
        onOk={() => {
          validateFieldsAndScroll((err, values) => {
            if (err) {
              return;
            }
            onCreate(values);
            resetFields();
          });
        }}
        onCancel={() => {
          onCancel();
          resetFields();
        }}
        title="Create new game"
        okText="Create"
      >
        <Form labelCol={{ sm: { span: 8 } }} wrapperCol={{ sm: { span: 16 } }}>
          <Form.Item label="Name">
            {getFieldDecorator('name', { rules: [{ required: true }] })(
              <Input />,
            )}
          </Form.Item>
          <Form.Item label="Use password?">
            {getFieldDecorator('usePassword', { valuePropName: 'checked' })(
              <Switch />,
            )}
          </Form.Item>
          {getFieldValue('usePassword') && (
            <Form.Item label="Password">
              {getFieldDecorator('password')(<Input type="password" />)}
            </Form.Item>
          )}
        </Form>
      </Modal>
    );
  },
);

export default function GameList() {
  const [pagination, setPagination] = React.useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [games, setGames] = React.useState<undefined | (Game[])>(undefined);
  React.useEffect(() => {
    eventing.lists.Games.find({
      skip: ((pagination.current || 1) - 1) * (pagination.pageSize || 1),
      take: pagination.pageSize,
    }).then(({ data, total }) => {
      setGames(data);
      setPagination(p => ({ ...p, total }));
    });
  }, [pagination.current, pagination.pageSize]);
  const [creatingNewGame, setCreatingNewGame] = React.useState(false);

  return (
    <div>
      <button onClick={() => setCreatingNewGame(true)}>Create Game</button>
      <CreateGameForm
        visible={creatingNewGame}
        onCreate={game => {
          eventing.aggregates.Game().create(game.name, game.password);
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
            dataIndex: 'name',
            key: 'name',
          },
        ]}
      />
    </div>
  );
}
