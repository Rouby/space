create table space.fleet (
  id            uuid primary key default uuid_generate_v1mc(),
  name          text not null check (char_length(name) < 80),
  game_id       uuid not null references space.game(id) on delete cascade,
  owner_id      uuid not null references space.person(id) on delete cascade,
  position      space.vector2 not null,
  foreign key (game_id, owner_id) references space.player(game_id, person_id)
);

comment on constraint fleet_game_id_owner_id_fkey on space.fleet is E'@fieldName player\n@foreignFieldName ownedFleets';

create index on space.fleet ( game_id );
create index on space.fleet ( owner_id );
create index on space.fleet ( game_id, owner_id );

grant select on table space.fleet to space_person;
alter table space.fleet enable row level security;

