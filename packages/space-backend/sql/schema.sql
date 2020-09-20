begin;


drop schema if exists space, space_private cascade;
drop role if exists space_postgraphile, space_anonymous, space_person;



create schema space;
create schema space_private;

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "plv8";

alter default privileges revoke execute on functions from public;

create role space_postgraphile login password 'hallo';

create role space_anonymous;
grant space_anonymous to space_postgraphile;

create role space_person;
grant space_person to space_postgraphile;

create type space.jwt_token as (
  role       text,
  person_id  uuid
);


create table space.person (
  id        uuid primary key default uuid_generate_v1mc(),
  name      text not null check (char_length(name) < 80)
);

create table space_private.account (
  person_id        uuid primary key references space.person(id) on delete cascade,
  email            text not null unique,
  password_hash    text not null
);

create function space.register(
  name       text,
  email      text,
  password   text
) returns space.person as $$
declare
  person space.person;
begin
  insert into space.person 
    (name)
  values
    (name)
  returning * into person;
  
  insert into space_private.account
    (person_id, email, password_hash)
  values
    (person.id, email, crypt(password, gen_salt('bf')));

  return person;
end;
$$ language plpgsql strict security definer;

create function space.authenticate(
  email      text,
  password   text
) returns space.jwt_token as $$
  select ('space_person', person_id)::space.jwt_token
  from space_private.account
  where
    account.email = $1
    and account.password_hash = crypt($2, account.password_hash);
$$ language sql strict security definer;

create function space.current_person() returns space.person as $$
  select *
  from space.person
  where
    id = current_setting('jwt.claims.person_id', true)::uuid
$$ language sql stable;

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
  class         space.planet_class not null
);


grant usage on schema space to space_anonymous, space_person;

grant select on table space.person to space_person;
grant select on table space.planet to space_person;

grant execute on function space.register(text, text, text) to space_anonymous;
grant execute on function space.authenticate(text, text) to space_anonymous, space_person;
grant execute on function space.current_person() to space_anonymous, space_person;


alter table space.person enable row level security;
alter table space.planet enable row level security;

create policy select_person on space.person for select
  using (true);

create policy select_planet on space.planet for select
  using (true);


commit;
