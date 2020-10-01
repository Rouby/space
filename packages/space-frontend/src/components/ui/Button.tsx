import { To } from 'history';
import * as React from 'react';
import { IconType } from 'react-icons';
import { AiOutlineLoading } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { animated, useTransition } from 'react-spring';
import { classes } from 'typestyle';
import { useKeyframes, useStylesheet } from '../../hooks';
import { colors, transition, units } from '../../style';

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: 'default' | 'primary' | 'dashed' | 'text' | 'link';
  icon?: IconType;
  loading?: boolean | Promise<unknown>;
  to?: To;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void | Promise<any>;
}

export function Button({
  variant = 'default',
  icon,
  to,
  loading,
  children,
  ...props
}: ButtonProps) {
  const classNames = useStylesheet({
    button: {
      '--button-border-color': colors.text.toString(),
      '--button-background-color': colors.textContrast.toString(),
      '--button-text-color': colors.text.toString(),
      '--button-highlight-border-color': colors.primary.toString(),
      '--button-highlight-background-color': colors.textContrast.toString(),
      '--button-highlight-text-color': colors.primary.toString(),
      '--button-disabled-border-color': colors.text.toString(),
      '--button-disabled-background-color': colors.textContrast.toString(),
      '--button-disabled-text-color': colors.text.toString(),
      '--button-press-color-from': colors.primary.lighten(0.1).toString(),
      '--button-press-color-to': colors.primary
        .lighten(0.1)
        .fadeOut(1)
        .toString(),

      margin: 0,
      padding: units(0.25, 1),
      width: 'auto',
      font: 'inherit',
      outline: 0,
      '-webkit-font-smoothing': 'inherit',
      '-moz-osx-font-smoothing': 'inherit',
      '-webkit-appearance': 'none',
      display: 'inline-block',
      fontWeight: 400,
      whiteSpace: 'nowrap',
      textAlign: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      height: units(2.5),
      lineHeight: '20px',
      fontSize: '14px',
      borderRadius: '2px',
      border: '1px solid var(--button-border-color)',
      backgroundColor: 'var(--button-background-color)',
      color: 'var(--button-text-color)',
      ...transition.ease('width', 'background-color', 'border-color', 'color'),
      $nest: {
        '&:-moz-focus-inner': {
          border: 0,
          padding: 0,
        },
        '&:hover': {
          borderColor: 'var(--button-highlight-border-color)',
          backgroundColor: 'var(--button-highlight-background-color)',
          color: 'var(--button-highlight-text-color)',
        },
        '&:focus': {
          borderColor: 'var(--button-highlight-border-color)',
          backgroundColor: 'var(--button-highlight-background-color)',
          color: 'var(--button-highlight-text-color)',
        },
        '&:disabled': {
          opacity: 0.8,
          borderColor: 'var(--button-disabled-border-color)',
          backgroundColor: 'var(--button-disabled-background-color)',
          color: 'var(--button-disabled-text-color)',
          $nest: {
            '&:hover': {
              borderColor: 'var(--button-disabled-border-color)',
              backgroundColor: 'var(--button-disabled-background-color)',
              color: 'var(--button-disabled-text-color)',
            },
          },
        },
      },
    },
    default: {},
    primary: {
      borderStyle: 'solid',
      '--button-border-color': colors.primary.toString(),
      '--button-background-color': colors.primary.toString(),
      '--button-text-color': colors.primaryContrast.toString(),
      '--button-highlight-border-color': colors.primary
        .lighten(0.08)
        .toString(),
      '--button-highlight-background-color': colors.primary
        .lighten(0.08)
        .toString(),
      '--button-highlight-text-color': colors.primaryContrast.toString(),
      '--button-disabled-border-color': colors.primary.toString(),
      '--button-disabled-background-color': colors.primary.toString(),
      '--button-disabled-text-color': colors.primaryContrast.toString(),
    },
    dashed: {
      borderStyle: 'dashed',
    },
    text: {
      borderStyle: 'solid',
      '--button-border-color': 'transparent',
      '--button-highlight-border-color': 'transparent',
      '--button-disabled-border-color': 'transparent',
      '--button-press-color-from': 'transparent',
      '--button-press-color-to': 'transparent',
    },
    link: {
      borderStyle: 'solid',
      '--button-border-color': 'transparent',
      '--button-highlight-border-color': 'transparent',
      '--button-disabled-border-color': 'transparent',
      '--button-text-color': colors.primary.toString(),
      '--button-press-color-from': 'transparent',
      '--button-press-color-to': 'transparent',
    },
    animated: {
      animationName: useKeyframes({
        from: { boxShadow: `0 0 2px 0px var(--button-press-color-from)` },
        to: { boxShadow: `0 0 2px 4px var(--button-press-color-to)` },
      }),
      animationDuration: '300ms',
    },
    icon: {
      display: 'inline-block',
      marginRight: units(0.5),
      marginLeft: units(-0.5),
      $nest: {
        '>svg': {
          marginTop: '2px',
          marginBottom: '-2px',
        },
      },
    },
    spinning: {
      animationName: useKeyframes({
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
      }),
      animationDuration: '600ms',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'linear',
    },
  });

  const pressedAt = React.useRef(0);
  const [isPressed, setPressed] = React.useState(false);
  const [clickPromise, setClickPromise] = React.useState<Promise<any>>();
  const [isLoading, setLoading] = React.useState(false);
  const [startTransition, isPending] = React.unstable_useTransition({
    timeoutMs: 3000,
  });
  loading = loading ?? clickPromise;
  const currentlyLoading =
    (typeof loading === 'boolean' ? loading : isLoading) || isPending;

  React.useEffect(() => {
    if (isPressed) {
      const timeout = setTimeout(() => setPressed(false), 300);
      return () => clearTimeout(timeout);
    }
    return;
  }, [isPressed]);

  React.useEffect(() => {
    if (loading instanceof Promise) {
      let mounted = true;
      let settled = false;
      const timeout = setTimeout(
        () => mounted && !settled && setLoading(true),
        100,
      );
      loading.finally(() => {
        mounted && setLoading(false);
        settled = true;
      });
      return () => {
        mounted = false;
        clearTimeout(timeout);
      };
    }
    return;
  }, [loading]);

  if (currentlyLoading) {
    icon = AiOutlineLoading;
  }

  const ref = React.useRef<HTMLButtonElement | null>(null);
  const iconTransition = useTransition(icon, null, {
    immediate: !ref.current,
    from: { opacity: 0, width: 0 },
    enter: { opacity: 1, width: 20 },
    leave: { opacity: 0, width: 0 },
    config: { tension: 280, friction: 120, duration: 300 },
  });

  const navigate = useNavigate();

  return (
    <button
      {...props}
      ref={ref}
      disabled={props.disabled || currentlyLoading}
      onMouseDown={(evt) => {
        setPressed(true);
        pressedAt.current = Date.now();
        props.onMouseDown?.(evt);
      }}
      onClick={(evt) => {
        if (Date.now() - pressedAt.current < 300 || pressedAt.current === 0) {
          setPressed(true);
        }
        pressedAt.current = 0;
        startTransition(() => {
          const result = props.onClick?.(evt);
          if (result instanceof Promise) {
            setClickPromise(result);
          }
          if (to) {
            navigate(to);
          }
        });
      }}
      className={classes(
        classNames.button,
        classNames[variant],
        isPressed && classNames.animated,
        props.className,
      )}
    >
      {iconTransition.map(
        ({ item: Icon, key, props }) =>
          Icon && (
            <animated.div key={key} className={classNames.icon} style={props}>
              <Icon
                className={classes(currentlyLoading && classNames.spinning)}
              />
            </animated.div>
          ),
      )}
      {children}
    </button>
  );
}
