import { IntlShape, FormatNumberOptions } from 'react-intl';
import { Uncertain } from './types';

export default function renderUncertain<T extends string | number>(
  val: T | Uncertain<T>,
  intl: IntlShape,
  { maximumFractionDigits = 0, ...options }: FormatNumberOptions = {},
) {
  if (typeof val === 'object') {
    if (typeof val.min === 'number' && typeof val.max === 'number') {
      return `${intl.formatNumber(val.min, {
        maximumFractionDigits,
        ...options,
      })} – ${intl.formatNumber(val.max, {
        maximumFractionDigits,
        ...options,
      })}`;
    }
    return `${val.min} – ${val.max}`;
  }
  if (typeof val === 'number') {
    return intl.formatNumber(val, {
      maximumFractionDigits,
      ...options,
    });
  }
  return val;
}
