create table space.building (
  id            uuid primary key default uuid_generate_v1mc(),
  name          text not null check (char_length(name) < 80)
);

grant select on table space.building to space_person;
alter table space.building enable row level security;

create policy select_building on space.building for select
  using (true);



create table space.planet_building (
  planet_id     uuid null references space.planet(id) on delete cascade,
  building_id   uuid null references space.building(id) on delete cascade,
  primary key (planet_id, building_id)
);

create index on space.planet ( planet_id );
create index on space.planet ( building_id );
create index on space.planet ( planet_id, building_id );
