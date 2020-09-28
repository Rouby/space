create type space.galaxy_type as enum (
  'spiral',
  'elliptical'
);

create type space.galaxy_size as enum (
  'tiny',
  'normal',
  'big',
  'giant'
);

create table space.game (
  id            uuid primary key default uuid_generate_v1mc(),
  name          text not null check (char_length(name) < 80),
  author_id     uuid references space.person(id) on delete set null default space.current_person_id(),
  player_slots  smallint not null default 6,
  type          space.galaxy_type not null default 'spiral',
  size          space.galaxy_size not null default 'normal',
  started       timestamp with time zone
);

comment on table space.game is E'@omit create';

create index on space.game ( author_id );


grant select, update, delete on table space.game to space_person;
alter table space.game enable row level security;

create policy select_game on space.game for select
  using (true);

create policy update_game on space.game for update to space_person
  using (author_id = current_setting('jwt.claims.person_id', true)::uuid);

create policy delete_game on space.game for delete to space_person
  using (author_id = current_setting('jwt.claims.person_id', true)::uuid);




create table space.player (
  game_id       uuid not null references space.game(id) on delete cascade,
  person_id     uuid not null references space.person(id) on delete cascade,
  primary key(game_id, person_id)
);

create index on space.player ( game_id );
create index on space.player ( person_id );


grant select, insert, update, delete on table space.player to space_person;
alter table space.player enable row level security;

create policy select_player on space.player for select
  using (true);

create policy insert_player on space.player for insert to space_person
  with check (person_id = current_setting('jwt.claims.person_id', true)::uuid);

create policy update_player on space.player for update to space_person
  using (person_id = current_setting('jwt.claims.person_id', true)::uuid)
  with check (person_id = current_setting('jwt.claims.person_id', true)::uuid);

create policy delete_player on space.player for delete to space_person
  using (person_id = current_setting('jwt.claims.person_id', true)::uuid);

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

create function space.join_game(
  game_id     uuid,
  race_id     uuid
) returns space.player as $$
declare
  player space.player;
begin
  insert into space.player 
    (game_id, person_id, race_id)
  values
    (game_id, space.current_person_id(), race_id)
  returning * into player;
  
  return player;
end;
$$ language plpgsql strict security definer;


grant execute on function space.join_game(uuid, uuid) to space_person;


-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

create function space.create_game(
  name  text
) returns space.game as $$
declare
  game space.game;
begin
  insert into space.game 
    (name)
  values
    (name)
  returning * into game;

  perform space.join_game(game_id := game.id, race_id := (select id from space.race limit 1));
  
  return game;
end;
$$ language plpgsql strict security definer;


grant execute on function space.create_game(text) to space_person;
