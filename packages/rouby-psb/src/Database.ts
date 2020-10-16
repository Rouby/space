import { Construct } from './Construct';

export class Database extends Construct {
  constructor() {
    super();
  }

  protected toSQL() {
    return this.children.map((child) => child.synthesize()).join('\n\n');
  }
}
