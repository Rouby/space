import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { AiOutlineCaretDown, AiOutlineLoading } from 'react-icons/ai';
import { classes } from 'typestyle';
import { useKeyframes, useStylesheet } from '../../hooks';
import { colors, elevation, transition, units } from '../../style';

type Renderable = { render?(): React.ReactNode; toString(): string };

interface SelectProps<TValue extends string | Renderable>
  extends Omit<
    React.DetailedHTMLProps<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      HTMLSelectElement
    >,
    'value' | 'defaultValue' | 'onChange'
  > {
  native?: boolean;
  options?: TValue[];
  value?: TValue;
  defaultValue?: TValue;
  onChange?: (event: { target: { value?: TValue } }) => void;
  useTransition?: boolean;
  errors?: Record<string, any>;
}

export const Select = React.forwardRef(Select_) as typeof Select_;

function Select_<TValue extends string | Renderable>(
  {
    native,
    value,
    defaultValue,
    onChange,
    options,
    useTransition,
    errors,
    ref: _,
    ...props
  }: SelectProps<TValue>,
  ref: React.Ref<HTMLSelectElement>,
) {
  const classNames = useStylesheet({
    container: {
      display: 'inline-block',
      position: 'relative',
      // height: units(2.5),
    },
    input: {
      margin: 0,
      padding: units(0.25, 1),
      paddingRight: units(3),
      width: 'auto',
      font: 'inherit',
      outline: 0,
      '-webkit-font-smoothing': 'inherit',
      '-moz-osx-font-smoothing': 'inherit',
      '-webkit-appearance': 'none',
      height: units(2.5),
      lineHeight: '22px',
      fontSize: '14px',
      borderRadius: '2px',
      border: `1px solid ${colors.text.fadeOut(0.6).toString()}`,
      backgroundColor: colors.textContrast.toString(),
      color: colors.text.toString(),
      ...transition.ease(
        'width',
        'padding',
        'background-color',
        'border-color',
        'box-shadow',
        'color',
      ),
      $nest: {
        '&:hover:not(:disabled)': {
          borderColor: colors.primary.lighten(0.1).toString(),
        },
        '&:focus': {
          borderColor: colors.primary.lighten(0.1).toString(),
          boxShadow: `0 0 0 2px ${colors.primary.lighten(0.1).fadeOut(0.6)}`,
        },
        '&:disabled': {
          cursor: 'not-allowed',
          backgroundColor: colors.disabled.toString(),
        },
      },
    },
    error: {
      borderColor: colors.error.toString(),
    },
    caret: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      right: units(1),
      pointerEvents: 'none',
    },
    loading: {
      paddingLeft: units(3),
      pointerEvents: 'none',
    },
    icon: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      left: units(1),
      overflow: 'hidden',
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
    value: {
      cursor: 'default',
      height: 0,
      visibility: 'hidden',
    },
    selected: {
      visibility: 'visible',
    },
    options: {
      overflow: 'auto',
      position: 'absolute',
      top: '100%',
      left: 0,
      minWidth: '100%',
      whiteSpace: 'nowrap',
      background: colors.textContrast.toString(),
      maxHeight: '300px',
      outline: 0,
      zIndex: 1,
      ...elevation(),
    },
    option: {
      padding: units(0.25, 1),
      paddingRight: units(3),
      userSelect: 'none',
      cursor: 'default',
    },
    focused: {
      backgroundColor: colors.primary.fadeOut(0.8).toString(),
    },
    disabled: {
      cursor: 'not-allowed',
      backgroundColor: colors.disabled.toString(),
    },
  });

  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? options?.[0],
  );

  const element = React.useRef<{
    name?: string;
    value?: TValue;
    type?: string;
    disabled?: boolean;
  }>(
    new Proxy({} as any, {
      get: (obj, key) => obj[key],
      set: (obj, key, value) => {
        obj[key] = value;
        return true;
      },
    }),
  ).current;
  element.name = props.name;
  element.disabled = props.disabled;
  element.type = 'custom';
  element.value = value ?? uncontrolledValue;

  React.useEffect(() => {
    if (typeof ref === 'function') {
      ref?.(element as any);
      return () => {
        ref?.(null);
      };
    }
    return;
  }, []);

  let [startTransition, isPending] = React.unstable_useTransition({
    timeoutMs: 3000,
  });
  if (!useTransition) {
    startTransition = (fn: () => void) => fn();
  }

  const useNative =
    native ??
    (value && typeof value === 'string') ??
    typeof options?.[0] === 'string';

  const [isFocused, setFocused] = React.useState(false);
  const [focusedOption, setFocusedOption] = React.useState<number>();

  return (
    <div className={classNames.container}>
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 20, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className={classNames.icon}
          >
            <AiOutlineLoading className={classNames.spinning} />
          </motion.div>
        )}
      </AnimatePresence>
      {useNative ? (
        <select
          {...props}
          className={classes(
            classNames.input,
            errors?.[props.name ?? ''] && classNames.error,
            isPending && classNames.loading,
            props.className,
          )}
          value={valueToString(value ?? uncontrolledValue)}
          onChange={({ target: { value: valueStr } }) => {
            const value = options?.find(
              (opt) => valueToString(opt) === valueStr,
            );
            startTransition(() => {
              onChange?.({ target: { value } });
              setUncontrolledValue(value);
            });
          }}
        >
          {options
            ?.map((opt) => valueToString(opt))
            .map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
        </select>
      ) : (
        <div
          {...(props as any)}
          className={classes(
            classNames.input,
            errors?.[props.name ?? ''] && classNames.error,
            isPending && classNames.loading,
            props.className,
          )}
          tabIndex={0}
          onBlur={() => setFocused(false)}
          onClick={() => setFocused(true)}
          onKeyDown={(evt) => {
            switch (evt.key) {
              case 'Enter':
              case ' ':
                setFocused(false);
                const opt =
                  focusedOption !== undefined && options?.[focusedOption];
                if (opt) {
                  startTransition(() => {
                    onChange?.({ target: { value: opt } });
                    setUncontrolledValue(opt);
                  });
                }
                evt.preventDefault();
                evt.stopPropagation();
                break;
              case 'ArrowUp':
                arrow(-1);
                break;
              case 'ArrowDown':
                arrow(1);
                break;
            }
            function arrow(n: number) {
              setFocused(true);
              if (isFocused) {
                setFocusedOption((i) =>
                  i === undefined
                    ? 0
                    : Math.max(0, Math.min((options?.length ?? 0) - 1, i + n)),
                );
              }
              evt.preventDefault();
              evt.stopPropagation();
            }
          }}
        >
          {options?.map((opt) => (
            <div
              key={valueToString(opt)}
              className={classes(
                classNames.value,
                valueToString(opt) ===
                  valueToString(value ?? uncontrolledValue) &&
                  classNames.selected,
              )}
            >
              {valueToNode(opt)}
            </div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: isFocused ? 1 : 0,
              pointerEvents: isFocused ? 'all' : 'none',
            }}
            className={classNames.options}
            tabIndex={-1}
            onFocus={() => setFocused(true)}
          >
            {options?.map((opt, idx) => (
              <div
                key={valueToString(opt)}
                className={classes(
                  classNames.option,
                  focusedOption === idx && classNames.focused,
                )}
                onMouseOver={() => setFocusedOption(idx)}
                onClick={(evt) => {
                  evt.preventDefault();
                  evt.stopPropagation();
                  setFocused(false);
                  startTransition(() => {
                    onChange?.({ target: { value: opt } });
                    setUncontrolledValue(opt);
                  });
                }}
              >
                {valueToNode(opt)}
              </div>
            ))}
          </motion.div>
        </div>
      )}
      <AiOutlineCaretDown className={classNames.caret} />
    </div>
  );
}

function valueToString(val: string | Renderable | undefined) {
  return val?.toString();
}

function valueToNode(val: string | Renderable | undefined) {
  return typeof val === 'string' ? val : val?.render?.() ?? val?.toString();
}
