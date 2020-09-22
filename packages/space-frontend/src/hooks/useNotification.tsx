import * as React from 'react';
import {
  NotificationHub,
  NotificationProps,
} from '../components/ui/Notification';

type NotificationConfig = Omit<
  NotificationProps,
  'key' | 'onClose' | 'type'
> & { duration?: number };

const NotificationContext = React.createContext<{
  success(notification: string | NotificationConfig): void;
  info(notification: string | NotificationConfig): void;
  warn(notification: string | NotificationConfig): void;
  error(notification: string | NotificationConfig): void;
}>({
  success(_notification: string | NotificationConfig) {},
  info(_notification: string | NotificationConfig) {},
  warn(_notification: string | NotificationConfig) {},
  error(_notification: string | NotificationConfig) {},
});

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = React.useState<NotificationProps[]>(
    [],
  );

  const api = React.useMemo(() => {
    return {
      success: createPusher('success'),
      info: createPusher('info'),
      warn: createPusher('warn'),
      error: createPusher('error'),
    };

    function createPusher(type: 'success' | 'info' | 'warn' | 'error') {
      return (notificationOrText: string | NotificationConfig) => {
        let notification: NotificationProps;
        let duration: number;
        const key = `${Math.random()}`;
        const onClose = () =>
          setNotifications((n) => n.filter((d) => d !== notification));
        if (typeof notificationOrText === 'string') {
          notification = { key, type, onClose, text: notificationOrText };
          duration = 4500;
        } else {
          notification = { key, type, onClose, ...notificationOrText };
          duration = notificationOrText.duration ?? 4500;
        }
        setNotifications((n) => [...n, notification]);
        if (duration) {
          console.log(duration);
          setTimeout(() => {
            setNotifications((n) => n.filter((d) => d !== notification));
          }, duration);
        }
      };
    }
  }, []);

  return (
    <NotificationContext.Provider value={api}>
      {children}
      <NotificationHub notifications={notifications} />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return React.useContext(NotificationContext);
}
