create table space.race (
  id            uuid primary key default uuid_generate_v1mc(),
  name          text not null check (char_length(name) < 80)
);

alter table space.player add
  race_id       uuid not null references space.race(id);

create index on space.player ( race_id );


grant select on table space.race to space_person;
alter table space.race enable row level security;

create policy select_race on space.race for select
  using (true);
