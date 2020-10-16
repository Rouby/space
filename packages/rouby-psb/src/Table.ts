import { Construct } from './Construct';
import { Role } from './Role';
import { Schema } from './Schema';

interface TableOptions {
  columns: TableColumn<any>[];
}

type TableOperation = 'select';
type TableGrant = {
  op: TableOperation;
  role: Role;
  columns: string[];
};
type TablePolicy = {
  op: TableOperation;
  name: string;
  using?: string;
  check?: string;
};

export class Table extends Construct {
  private grants: TableGrant[] = [];
  private policies: TablePolicy[] = [];

  constructor(
    private schema: Schema,
    private $name: string,
    private options: TableOptions,
  ) {
    super(schema);
  }

  public get name() {
    return `\`${this.schema.name}\`.\`${this.$name}\``;
  }

  public grant(op: TableOperation, ...columns: string[]) {
    const grant = { op, columns } as TableGrant;
    this.grants.push(grant);
    return {
      to(role: Role) {
        grant.role = role;
        return this;
      },
    };
  }

  public policy(op: TableOperation) {
    const policy = { op, name: `${op}_${this.$name}` } as TablePolicy;
    this.policies.push(policy);
    return {
      name(name: string) {
        policy.name = name;
      },
      using(using: string) {
        policy.using = using;
      },
      check(check: string) {
        policy.check = check;
      },
    };
  }

  protected toSQL() {
    return `create table ${this.name} (
${this.options.columns.map((column) => column.synthesize()).join(',\n')}
);

alter table ${this.name} enable row level security;

${this.policies
  .map(
    ({ op, name, check, using }) =>
      `create policy ${name} on ${this.name} for ${op}${[
        `${using ? `\nusing (${using})` : ''}`,
        `${check ? `\ncheck (${check})` : ''}`,
      ].join('')};`,
  )
  .join('\n\n')}

${this.grants
  .map(
    ({ op, role, columns }) =>
      `grant ${op}${
        columns.length > 0 ? `(${columns.join(', ')})` : ''
      } on table ${this.name} to ${role.name};`,
  )
  .join('\n\n')}`;
  }
}

export class TableColumnCheck {
  constructor(private fn: (columnName: string) => string) {}

  synthesize(columnName: string) {
    return this.fn(columnName);
  }
}

type TableColumnTypeDefault = {
  uuid: string;
  smallint: number;
  text: string;
};
type TableColumnType = keyof TableColumnTypeDefault;

export class TableColumn<T extends TableColumnType> extends Construct {
  private modifiers = {
    primary: false,
    nullable: true,
    checks: [] as TableColumnCheck[],
    default: null as TableColumnTypeDefault[T] | null,
  };

  constructor(private name: string, private type: T) {
    super();
  }

  public primary() {
    this.modifiers.primary = true;
    this.modifiers.nullable = false;
    return this;
  }

  public nullable() {
    if (this.modifiers.primary) {
      throw new Error('Cannot declare primary key as nullable!');
    }
    this.modifiers.nullable = true;
    return this;
  }

  public notNullable() {
    this.modifiers.nullable = false;
    return this;
  }

  public check(check: TableColumnCheck) {
    this.modifiers.checks.push(check);
    return this;
  }

  public default(value: TableColumnTypeDefault[T]) {
    this.modifiers.default = value;
    return this;
  }

  protected toSQL() {
    const modifiers = [
      this.modifiers.primary ? 'primary key' : '',
      this.modifiers.nullable || this.modifiers.primary ? '' : 'not null',
      this.modifiers.default,
      this.modifiers.checks.length > 0
        ? `check (${this.modifiers.checks
            .map((check) => check.synthesize(this.name))
            .join(' and ')})`
        : '',
    ]
      .filter(Boolean)
      .join(' ');

    return `\`${this.name}\` ${this.type} ${modifiers}`;
  }
}
