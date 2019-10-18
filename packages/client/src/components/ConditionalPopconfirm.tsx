import { Popconfirm } from 'antd';
import * as React from 'react';

export default function ConditionalPopconfirm({
  children,
  condition,
  ...rest
}: {
  condition: boolean;
} & import('antd/lib/popconfirm').PopconfirmProps) {
  const [visible, setVisible] = React.useState(false);
  return (
    <Popconfirm
      {...rest}
      visible={visible}
      onVisibleChange={v => {
        if (!v) {
          setVisible(v);
          return;
        }
        if (!condition) {
          setVisible(false);
          rest.onConfirm && rest.onConfirm();
        } else {
          setVisible(v);
        }
      }}
      onConfirm={e => {
        rest.onConfirm && rest.onConfirm(e);
      }}
      onCancel={() => setVisible(false)}
    >
      {children}
    </Popconfirm>
  );
}
