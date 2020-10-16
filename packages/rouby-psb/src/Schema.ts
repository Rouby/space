import { Construct } from './Construct';
import { Database } from './Database';

export class Schema extends Construct {
  constructor(db: Database, private $name: string) {
    super(db);
  }

  public get name() {
    return this.$name;
  }

  protected toSQL() {
    return `create schema \`${this.name}\`;

${this.children.map((child) => child.synthesize()).join('\n\n')}`;
  }
}
