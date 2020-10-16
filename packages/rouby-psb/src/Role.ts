import { Construct } from './Construct';
import { Database } from './Database';

export class Role extends Construct {
  private grantedTo: Role[] = [];
  private modifiers = {
    password: '',
  };

  constructor(db: Database, private $name: string) {
    super(db);
  }

  public get name() {
    return `\`${this.$name}\``;
  }

  public login(password: string) {
    this.modifiers.password = password;
    return this;
  }

  public grantTo(role: Role) {
    this.grantedTo.push(role);
  }

  protected toSQL() {
    return `create role ${this.name}${
      this.modifiers.password
        ? ` login password '${this.modifiers.password}'`
        : ''
    };
${this.grantedTo
  .map((role) => `grant ${this.name} to ${role.name};`)
  .join('\n')}`;
  }
}
