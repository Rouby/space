import { Game } from '@space/server/src/read/Games';
import { Form, Input, Modal, Switch, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';

interface CreateGameFormProps extends FormComponentProps<Game> {
  visible: boolean;
  onCreate: (game: Game) => void;
  onCancel: () => void;
}

export default Form.create<CreateGameFormProps>()(function CreateGameForm({
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
            <Input autoComplete="off" />,
          )}
        </Form.Item>
        <Form.Item label="Use password?">
          {getFieldDecorator('usePassword', { valuePropName: 'checked' })(
            <Switch />,
          )}
        </Form.Item>
        {getFieldValue('usePassword') && (
          <Form.Item label="Password">
            {getFieldDecorator('password')(
              <Input type="password" autoComplete="new-password" />,
            )}
          </Form.Item>
        )}
        <Form.Item label="Player slots">
          {getFieldDecorator('playerSlots', {
            rules: [{ required: true }],
            initialValue: 6,
          })(<InputNumber min={2} max={16} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
});
