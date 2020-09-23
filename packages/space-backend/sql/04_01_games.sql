create table space.game (
  id            uuid primary key default uuid_generate_v1mc(),
  name          text not null check (char_length(name) < 80),
  author_id     uuid not null references space.person(id) on delete cascade,
  started       timestamp with time zone
);

create index on space.game ( author_id );


grant select, insert, update, delete on table space.game to space_person;
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
    (game_id, person_id, race_id)
  returning * into player;
  
  return player;
end;
$$ language plpgsql strict security definer;


grant execute on function space.join_game(uuid, uuid) to space_person;
