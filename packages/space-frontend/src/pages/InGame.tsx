import gql from 'graphql-tag';
import * as React from 'react';
import { GalaxyMapQuery, GalaxyMapQueryVariables } from '../api/types';
import { useGraphQLQuery, useStylesheet } from '../hooks';

export function InGamePage() {
  return (
    <>
      <GalaxyMap />
    </>
  );
}

function GalaxyMap() {
  const classNames = useStylesheet({
    container: {
      background: 'black',
      width: '100vw',
      height: '100vh',
      overflow: 'auto',
    },
    map: {
      position: 'relative',
      background: 'rgba(255,0,0,0.5)',
      display: 'inline-block',
    },
    vision: {
      position: 'absolute',
      pointerEvents: 'none',
      background: 'gray',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
    },
    planet: {
      position: 'absolute',
      background: 'red',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      width: 5,
      height: 5,
    },
  });

  const {
    data: {
      data: { planets, visions },
    },
  } = useGraphQLQuery<GalaxyMapQuery, GalaxyMapQueryVariables>(
    gql`
      query GalaxyMap {
        planets {
          nodes {
            id
            name
            owner {
              id
              name
            }
            position {
              x
              y
            }
            class
          }
        }
        visions {
          nodes {
            circle
          }
        }
      }
    `,
  );

  const [minX, minY, maxX, maxY] = visions?.nodes.reduce(
    ([minX, minY, maxX, maxY], vision) => {
      const circle = parseCircle(vision.circle);
      if (circle) {
        return [
          Math.min(minX, circle.x - circle.radius),
          Math.min(minY, circle.y - circle.radius),
          Math.max(maxX, circle.x + circle.radius),
          Math.max(maxY, circle.y + circle.radius),
        ] as const;
      }
      return [minX, minY, maxX, maxY] as const;
    },
    [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
    ] as const,
  ) ?? [0, 0, 0, 0];

  const [container, width, height] = useElementSize<HTMLDivElement>();
  const visibleWidth = maxX - minX;
  const visibleHeight = maxY - minY;

  // console.log(visibleWidth, visibleHeight, boundsX, boundsY);

  const [mapPadding, setMapPadding] = React.useState([0, 0] as [
    number,
    number,
  ]);

  React.useLayoutEffect(() => {
    if (container.current) {
      setMapPadding([
        Math.max(0, width / 2 - visibleWidth / 2),
        Math.max(0, height / 2 - visibleHeight / 2),
      ]);
    }
  }, [visibleWidth, visibleHeight, width, height]);

  return (
    <div className={classNames.container} ref={container}>
      <div
        className={classNames.map}
        style={{
          width: visibleWidth,
          height: visibleHeight,
          transform: `translate(${mapPadding[0]}px, ${mapPadding[1]}px)`,
        }}
      >
        {visions?.nodes.map((vision, idx) => {
          const circle = parseCircle(vision.circle);
          if (!circle) {
            return null;
          }
          return (
            <div
              key={idx}
              className={classNames.vision}
              style={{
                left: circle.x - minX,
                top: circle.y - minY,
                width: circle.radius * 2,
                height: circle.radius * 2,
              }}
            />
          );
        })}
        {planets?.nodes.map((planet) => (
          <div
            key={planet.id}
            title={planet.name}
            className={classNames.planet}
            style={{
              left: planet.position.x - minX,
              top: planet.position.y - minY,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

function parseCircle(str?: string | null) {
  const result = /^<\((-?[\d.]+),(-?[\d.]+)\),(-?[\d.]+)>$/.exec(str ?? '');

  if (result) {
    return { x: +result[1], y: +result[2], radius: +result[3] };
  }
  return undefined;
}

type BoxSize = { blockSize: number; inlineSize: number };
declare var ResizeObserver: new (
  cb: (
    entries: {
      target: Element;
      contentRect: DOMRectReadOnly;
      borderBoxSize: BoxSize;
      contentBoxSize: BoxSize;
    }[],
  ) => void,
) => {
  observe(target: Element): void;
  unobserve(target: Element): void;
  disconnect(): void;
};

function useElementSize<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);

  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  const [observer] = React.useState(
    () =>
      new ResizeObserver((entries) => {
        const entry = entries.find((e) => e.target === ref.current);
        if (entry) {
          setWidth(entry.contentRect.width);
          setHeight(entry.contentRect.height);
        }
      }),
  );

  React.useEffect(() => {
    if (ref.current) {
      const elem = ref.current;
      observer.observe(elem);
      return () => observer.unobserve(elem);
    }
    return;
  });

  return [ref, width, height] as const;
}
