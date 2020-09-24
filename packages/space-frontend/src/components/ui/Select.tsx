import * as React from 'react';

interface SelectProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  errors?: Record<string, any>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ ...props }, ref) {
    return (
      <select {...props} ref={ref}>
        <option>test</option>
      </select>
    );
  },
);
