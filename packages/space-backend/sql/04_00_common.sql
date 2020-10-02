create type space.vector2 as (
  x   float,
  y   float
);

COMMENT ON COLUMN space.vector2.x IS E'@notNull';
COMMENT ON COLUMN space.vector2.y IS E'@notNull';
