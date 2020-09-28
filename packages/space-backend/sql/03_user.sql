create type space.jwt as (
  role       text,
  person_id  uuid
);



create table space.person (
  id        uuid primary key default uuid_generate_v1mc(),
  name      text not null check (char_length(name) < 80)
);

grant select on table space.person to space_person;
alter table space.person enable row level security;

create policy select_person on space.person for select
  using (true);


create table space_private.account (
  person_id        uuid primary key references space.person(id) on delete cascade,
  email            text not null unique,
  password_hash    text not null
);


-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

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


grant execute on function space.register(text, text, text) to space_anonymous;

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

create function space.authenticate(
  email      text,
  password   text
) returns space.jwt as $$
  select ('space_person', person_id)::space.jwt
  from space_private.account
  where
    account.email = $1
    and account.password_hash = crypt($2, account.password_hash);
$$ language sql strict security definer;


grant execute on function space.authenticate(text, text) to space_anonymous, space_person;

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

create function space.current_person_id() returns uuid as $$
begin
  return nullif(current_setting('jwt.claims.person_id', true), '')::uuid;
end
$$ language plpgsql;

grant execute on function space.current_person_id() to space_anonymous, space_person;


create function space.current_person() returns space.person as $$
  select *
  from space.person
  where
    id = current_setting('jwt.claims.person_id', true)::uuid
$$ language sql stable;


grant execute on function space.current_person() to space_anonymous, space_person;
