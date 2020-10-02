create view space.vision as (
  select position, 50::float as range from space.planet where owner_id = space.current_person_id() and game_id = space.current_game_id() union
  select position, 30::float as range from space.fleet where owner_id = space.current_person_id() and game_id = space.current_game_id()
);

grant select on table space.vision to space_person;

create function space.is_visible(
  game_id      uuid,
  "position"   space.vector2
) returns boolean as $$
  const vision = plv8.execute('select position, range from space.vision');

  return vision.some(v => Math.sqrt( (v.position.x - position.x) ** 2 + (v.position.y - position.y) ** 2 ) <= v.range);
$$ language plv8 strict security definer;

grant execute on function space.is_visible(uuid, space.vector2) to space_person;


create policy select_planet on space.planet for select
  using (space.is_visible(game_id, position));

create policy select_fleet on space.fleet for select
  using (space.is_visible(game_id, position));
