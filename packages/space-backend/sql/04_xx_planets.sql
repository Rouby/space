-- http://www.startrekmap.com/library/objects/planetclass.html
create type space.planet_class as enum (
  'class_a', -- geothermal
  'class_c', -- geoinactive
  'class_d', -- astroid / moon
  'class_h', -- desert
  'class_j', -- gas giant
  'class_k', -- adaptable
  'class_l', -- marginal
  'class_m', -- terrestial
  'class_o', -- pelagic
  'class_p', -- glaciated
  'class_r', -- rogue
  'class_y'  -- demon
);

create table space.planet (
  id            uuid primary key default uuid_generate_v1mc(),
  name          text not null check (char_length(name) < 80),
  game_id       uuid not null references space.game(id) on delete cascade,
  owner_id      uuid references space.person(id) on delete set null default null,
  class         space.planet_class not null,
  position      space.vector2 not null,
  foreign key (game_id, owner_id) references space.player(game_id, person_id)
);

comment on constraint planet_game_id_owner_id_fkey on space.planet is E'@fieldName player\n@foreignFieldName ownedPlanets';

create index on space.planet ( game_id );
create index on space.planet ( owner_id );
create index on space.planet ( game_id, owner_id );


grant select on table space.planet to space_person;
alter table space.planet enable row level security;
