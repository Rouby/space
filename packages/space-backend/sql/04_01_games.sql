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

create type space.game_state as enum (
  'create',
  'starting',
  'running',
  'done'
);

create table space.game (
  id            uuid primary key default uuid_generate_v1mc(),
  name          text not null check (char_length(name) < 80),
  author_id     uuid references space.person(id) on delete set null default space.current_person_id(),
  player_slots  smallint not null default 6,
  type          space.galaxy_type not null default 'spiral',
  size          space.galaxy_size not null default 'normal',
  state         space.game_state not null default 'create',
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
  turn_ended    boolean not null default false,
  primary key(game_id, person_id)
);

create index on space.player ( game_id );
create index on space.player ( person_id );


grant select on table space.player to space_person;
alter table space.player enable row level security;

create policy select_player on space.player for select
  using (true);

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


-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

create function space.start_game(
  game_id  uuid
) returns space.game as $$
  const [correctGame] = plv8.execute('select * from space.game where id = $1 and author_id = space.current_person_id()' , [ game_id ]);

  if (!correctGame) {
    throw new Error('You cannot start this game');
  }

  plv8.execute(`update space.game set state = 'starting' where id = $1`, [ game_id ]);
  plv8.execute(`select graphile_worker.add_job(
    'startGame',
    payload := json_build_object (
      'gameId', $1
    )
  )`, [ game_id ]);

  return plv8.execute('select * from space.game where id = $1 and author_id = space.current_person_id()' , [ game_id ])[0];
$$ language plv8 security definer;


grant execute on function space.start_game(uuid) to space_person;

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

create function space.end_turn()
returns boolean as $$
  const [player] = plv8.execute('select * from space.player where game_id = space.current_game_id() and person_id = space.current_person_id() and turn_ended = false');

  if (!player) {
    throw new Error('You cannot end your turn now');
  }

  // TODO check if game started

  plv8.execute(`update space.player set turn_ended = true where game_id = space.current_game_id() and person_id = space.current_person_id()`);
  plv8.execute(`select graphile_worker.add_job(
    'calculateGameRound',
    payload := json_build_object (
      'gameId', space.current_game_id()
    )
  )`);

  return true;
$$ language plv8 security definer;


grant execute on function space.end_turn() to space_person;

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

create function space.current_game_id() returns uuid as $$
begin
  return nullif(current_setting('jwt.game_id', true), '')::uuid;
end
$$ language plpgsql;

grant execute on function space.current_game_id() to space_anonymous, space_person;


create function space.current_game() returns space.game as $$
  select *
  from space.game
  where
    id = space.current_game_id()
$$ language sql stable;


grant execute on function space.current_game() to space_anonymous, space_person;


create function space.current_player() returns space.player as $$
  select *
  from space.player
  where
    game_id = space.current_game_id() and
    person_id = space.current_person_id()
$$ language sql stable;


grant execute on function space.current_player() to space_anonymous, space_person;
