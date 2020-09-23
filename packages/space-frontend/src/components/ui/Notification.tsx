import * as React from 'react';
import {
  AiOutlineCheckCircle,
  AiOutlineClose,
  AiOutlineExclamationCircle,
  AiOutlineInfoCircle,
  AiOutlineWarning,
} from 'react-icons/ai';
import { animated, useTransition } from 'react-spring';
import { stylesheet } from 'typestyle';
import { colors, elevation, units } from '../../style';

const icons = {
  success: AiOutlineCheckCircle,
  info: AiOutlineInfoCircle,
  warn: AiOutlineWarning,
  error: AiOutlineExclamationCircle,
  none: null,
};

const classNames = stylesheet({
  container: {
    position: 'fixed',
    top: units(1),
    right: units(0),
  },
  box: {
    width: units(32),
    maxWidth: `calc(100vw - ${units(1)})`,
    background: 'white',
    overflow: 'hidden',
    marginBottom: units(1),
    marginRight: units(1),
    ...elevation(),
  },
  notification: {
    position: 'relative',
    padding: units(1.5, 2, 1),
    lineHeight: 1.5715,
  },
  icon: {
    position: 'absolute',
    fontSize: '24px',
    lineHeight: '24px',
    marginRight: units(1),
  },
  success: { color: colors.success.toString() },
  info: { color: colors.info.toString() },
  warn: { color: colors.warn.toString() },
  error: { color: colors.error.toString() },
  none: {},
  title: {
    fontSize: '16px',
    lineHeight: '24px',
    display: 'block',
    paddingRight: units(2),
    marginBottom: units(0.5),
  },
  description: {
    fontSize: '14px',
  },
  withIcon: {
    marginLeft: units(3),
  },
  close: {
    fontSize: '16px',
    height: '24px',
    position: 'absolute',
    right: units(2),
    color: colors.text.fadeOut(0.3).toString(),
  },
});

export interface NotificationProps {
  key: string;
  type: 'success' | 'info' | 'warn' | 'error' | 'none';
  text: React.ReactNode;
  description?: React.ReactNode;
  onClose: () => void;
}

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  function Notification({ type, text, description, onClose }, ref) {
    const Icon = icons[type];

    return (
      <div ref={ref} className={classNames.notification}>
        {Icon && <Icon className={`${classNames.icon} ${classNames[type]}`} />}
        <AiOutlineClose className={classNames.close} onClick={onClose} />
        <div
          className={`${classNames.title} ${Icon ? classNames.withIcon : ''}`}
        >
          {text}
        </div>
        {description && (
          <div
            className={`${classNames.description} ${
              Icon ? classNames.withIcon : ''
            }`}
          >
            {description}
          </div>
        )}
      </div>
    );
  },
);

export function NotificationHub({
  notifications,
}: {
  notifications: NotificationProps[];
}) {
  const [refMap] = React.useState(
    () => new WeakMap<NotificationProps, HTMLDivElement | null>(),
  );
  const transitions = useTransition(notifications, (n) => n.key, {
    from: { opacity: 0, transform: 'translateX(100%)' },
    enter: { opacity: 1, transform: 'translateX(0%)' },
    leave: { opacity: 0 },
    config: { tension: 500, friction: 25, precision: 0.1 },
  });

  return (
    <div className={classNames.container}>
      {transitions.map(({ key, props, item }) => (
        <animated.div key={key} className={classNames.box} style={props}>
          <Notification ref={(ref) => refMap.set(item, ref)} {...item} />
        </animated.div>
      ))}
    </div>
  );
}
