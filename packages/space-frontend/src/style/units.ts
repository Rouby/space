export function units(...x: number[]) {
  return x.map((v) => `${v * 12}px`).join(' ');
}
