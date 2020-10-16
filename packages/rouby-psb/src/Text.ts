import { TableColumnCheck } from './Table';

export function charLength(maxLength: number) {
  return new TableColumnCheck((name) => `char_length(${name}) < ${maxLength}`);
}
