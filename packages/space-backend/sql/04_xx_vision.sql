create function space.hashpoint(point) returns integer
   language sql immutable
   as 'select hashfloat8($1[0]) # hashfloat8($1[1])';

grant execute on function space.hashpoint(point) to space_person;

create function space.hashcircle(circle) returns integer
   language sql immutable
   as 'select space.hashpoint(center($1)) # hashfloat8(radius($1))';

grant execute on function space.hashcircle(circle) to space_person;

create operator class space.circle_hash_ops default for type circle using hash as
   operator 1 ~=(circle,circle),
   function 1 space.hashcircle(circle);

create view space.vision as (
  -- select (position, 50) as circle from space.planet where owner_id = space.current_person_id() and game_id = space.current_game_id() union
  -- select (position, 30) as circle from space.fleet where owner_id = space.current_person_id() and game_id = space.current_game_id()
        select circle (position, 50) as circle from space.planet where owner_id = space.current_person_id() and game_id = space.current_game_id()
  union select circle (position, 30) as circle from space.fleet where owner_id = space.current_person_id() and game_id = space.current_game_id()
);

grant select on table space.vision to space_person;

create function space.is_visible(
  game_id      uuid,
  "position"   point
) returns boolean as $$
  const [vision] = plv8.execute('select count(*) as count from space.vision where circle @> $1::point', [ position ]);

  return vision.count > 0;
$$ language plv8 strict security definer;

grant execute on function space.is_visible(uuid, point) to space_person;


create policy select_planet on space.planet for select
  using (space.is_visible(game_id, position));

create policy select_fleet on space.fleet for select
  using (space.is_visible(game_id, position));
