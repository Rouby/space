import {
  Database,
  Role,
  Schema,
  Table,
  TableColumn,
  Text,
  UUID,
} from '@rouby/psb';

const db = new Database();

const roles = {
  postgraphile: new Role(db, 'space_postgraphile').login('hallo'),
  anonymous: new Role(db, 'space_anonymous'),
  person: new Role(db, 'space_person'),
};

roles.anonymous.grantTo(roles.postgraphile);
roles.person.grantTo(roles.postgraphile);

const space = new Schema(db, 'space');
const spacePrivate = new Schema(db, 'space_private');

const persons = new Table(space, 'person', {
  columns: [
    new TableColumn('id', 'uuid').primary().default(UUID.generated()),
    new TableColumn('name', 'text').notNullable().check(Text.charLength(80)),
  ],
});

persons.grant('select').to(roles.person);
persons.policy('select').using('true');

new Table(spacePrivate, 'account', { columns: [] });

console.log(db.synthesize());
