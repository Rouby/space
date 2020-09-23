alter default privileges revoke execute on functions from public;

create role space_postgraphile login password 'hallo';

create role space_anonymous;
grant space_anonymous to space_postgraphile;

create role space_person;
grant space_person to space_postgraphile;
