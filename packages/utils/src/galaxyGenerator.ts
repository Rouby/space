import * as random from 'random';
import { GalaxyType, GalaxySize } from '@space/types';

const count = {
  [GalaxySize.Small]: 100,
  [GalaxySize.Medium]: 200,
  [GalaxySize.Large]: 300,
};

export function generateSystemPositions(type: GalaxyType, size: GalaxySize) {
  const systems: { x: number; y: number }[] = [];

  const φ = random.float(0, Math.PI);

  switch (type) {
    case GalaxyType.Elliptical:
      {
        const rngX = random.normal(
          0,
          random.float(count[size] / 20, count[size] / 12),
        );
        const rngY = random.normal(0, count[size] / 8);
        for (let i = 0; i < count[size]; ++i) {
          const x = rngX();
          const y = rngY();
          const tx = x * Math.cos(φ) - y * Math.sin(φ);
          const ty = y * Math.cos(φ) + x * Math.sin(φ);
          systems.push({ x: tx, y: ty });
        }
      }
      break;
    case GalaxyType.Spiral:
      {
        const n = random.int(2, 4);
        for (let i = 0; i < n; ++i) {
          systems.push(...genArm(φ + ((Math.PI * 2) / n) * i, n));
        }
      }
      break;
  }

  return systems;

  function genArm(φ: number, armCount: number) {
    const points = [];
    const rngX = random.normal(0, 3);
    const rngY = random.normal(0, 3);
    for (let i = 0; i < Math.log10(count[size]) ** 2 * 14; ++i) {
      for (let o = 0; o < 25 / (i + 1) / armCount; ++o) {
        const x = i + rngX();
        const y = rngY();
        const tx =
          x * Math.cos(φ + i ** 1.5 / 100) - y * Math.sin(φ + i ** 1.5 / 100);
        const ty =
          y * Math.cos(φ + i ** 1.5 / 100) + x * Math.sin(φ + i ** 1.5 / 100);
        points.push({ x: tx, y: ty });
      }
    }
    return points;
  }
}
