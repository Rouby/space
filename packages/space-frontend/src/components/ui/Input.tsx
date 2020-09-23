import * as React from 'react';
import { classes } from 'typestyle';
import { useStylesheet } from '../../hooks';
import { colors, transition, units } from '../../style';

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  errors?: Record<string, any>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ errors, ...props }, ref) {
    const classNames = useStylesheet({
      input: {
        margin: 0,
        padding: units(0.25, 1),
        width: 'auto',
        font: 'inherit',
        outline: 0,
        '-webkit-font-smoothing': 'inherit',
        '-moz-osx-font-smoothing': 'inherit',
        '-webkit-appearance': 'none',
        height: units(2.5),
        lineHeight: '20px',
        fontSize: '14px',
        borderRadius: '2px',
        border: `1px solid ${colors.text.fadeOut(0.6).toString()}`,
        backgroundColor: colors.textContrast.toString(),
        color: colors.text.toString(),
        ...transition.ease(
          'width',
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
    });

    return (
      <input
        {...props}
        ref={ref}
        className={classes(
          classNames.input,
          errors?.[props.name ?? ''] && classNames.error,
          props.className,
        )}
      />
    );
  },
);
