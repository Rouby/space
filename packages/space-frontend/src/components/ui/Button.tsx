import * as React from 'react';
import { IconType } from 'react-icons';
import { AiOutlineLoading } from 'react-icons/ai';
import { animated, useTransition } from 'react-spring';
import { classes, keyframes, stylesheet } from 'typestyle';
import { colors, transition, units } from '../../style';

const classNames = stylesheet({
  button: {
    margin: 0,
    padding: units(0.25, 1),
    width: 'auto',
    overflow: 'visible',
    background: 'transparent',
    font: 'inherit',
    outline: 0,
    '-webkit-font-smoothing': 'inherit',
    '-moz-osx-font-smoothing': 'inherit',
    '-webkit-appearance': 'none',
    display: 'inline-flex',
    alignItems: 'baseline',
    fontWeight: 400,
    whiteSpace: 'nowrap',
    textAlign: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    height: units(2.5),
    lineHeight: '20px',
    fontSize: '14px',
    borderRadius: '2px',
    '--button-border-color': colors.text.toString(),
    '--button-background-color': colors.textContrast.toString(),
    '--button-text-color': colors.text.toString(),
    '--button-highlight-border-color': colors.primary.toString(),
    '--button-highlight-background-color': colors.textContrast.toString(),
    '--button-highlight-text-color': colors.primary.toString(),
    '--button-disabled-border-color': colors.text.toString(),
    '--button-disabled-background-color': colors.textContrast.toString(),
    '--button-disabled-text-color': colors.text.toString(),
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
    '--button-highlight-border-color': colors.primary.lighten(0.08).toString(),
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
  },
  link: {
    borderStyle: 'solid',
    '--button-border-color': 'transparent',
    '--button-highlight-border-color': 'transparent',
    '--button-text-color': colors.primary.toString(),
  },
  animated: {
    animationName: keyframes({
      from: {
        boxShadow: `0 0 2px 0px ${colors.primary.lighten(0.1)}`,
      },
      to: {
        boxShadow: `0 0 2px 4px ${colors.primary.lighten(0.1).fadeOut(1)}`,
      },
    }),
    animationDuration: '300ms',
  },
  icon: {
    display: 'inline-block',
    margin: 'auto',
    marginRight: units(0.5),
    marginLeft: units(-0.5),
    $nest: {
      '>svg': {
        width: '100%',
        height: '100%',
        padding: '2px',
      },
    },
  },
  spinning: {
    animationName: keyframes({
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    }),
    animationDuration: '600ms',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
});

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: 'default' | 'primary' | 'dashed' | 'text' | 'link';
  icon?: IconType;
  loading?: boolean | Promise<unknown>;
}

export function Button({
  variant = 'default',
  icon,
  loading,
  children,
  ...props
}: ButtonProps) {
  const pressedAt = React.useRef(0);
  const [isPressed, setPressed] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const currentlyLoading = typeof loading === 'boolean' ? loading : isLoading;

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
      setLoading(true);
      loading.then(
        () => mounted && setLoading(false),
        () => mounted && setLoading(false),
      );
      return () => {
        mounted = false;
      };
    }
    return;
  }, [loading]);

  if (currentlyLoading) {
    icon = AiOutlineLoading;
  }

  const ref = React.useRef<HTMLButtonElement | null>(null);
  const transitions = useTransition(icon, null, {
    immediate: !ref.current,
    from: { opacity: 0, width: 0 },
    enter: { opacity: 1, width: 20 },
    leave: { opacity: 0, width: 0 },
    config: { tension: 280, friction: 120, duration: 300 },
  });

  return (
    <button
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
        props.onClick?.(evt);
      }}
      className={classes(
        classNames.button,
        classNames[variant],
        isPressed && classNames.animated,
        props.className,
      )}
      {...props}
    >
      {transitions.map(
        ({ item: Icon, key, props }) =>
          Icon && (
            <animated.div key={key} className={classNames.icon} style={props}>
              <Icon className={classes(loading && classNames.spinning)} />
            </animated.div>
          ),
      )}
      {children}
    </button>
  );
}
