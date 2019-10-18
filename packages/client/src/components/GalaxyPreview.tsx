import { GalaxySize, GalaxyType } from '@space/types';
import { generateSystemPositions } from '@space/utils';
import * as React from 'react';

export default function GalaxyPreview({
  type,
  size,
}: {
  type: GalaxyType;
  size: GalaxySize;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas && canvas.getContext('2d');
    if (!canvas || !gl) {
      return;
    }
    const { width, height } = canvas;
    gl.clearRect(0, 0, width, height);

    generateSystemPositions(type, size).forEach(({ x, y }) => {
      gl.beginPath();
      gl.ellipse(
        (x / 100) * width + width / 2,
        (y / 100) * width + width / 2,
        2,
        2,
        0,
        0,
        Math.PI * 2,
      );
      gl.closePath();
      gl.fill();
    });
  }, [type, size]);

  return (
    <>
      <canvas ref={canvasRef} width={200} height={200} />
    </>
  );
}
