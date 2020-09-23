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
  class         space.planet_class not null,
  position      space.vector2 not null
);


grant select on table space.planet to space_person;
alter table space.planet enable row level security;

create policy select_planet on space.planet for select
  using (true);
