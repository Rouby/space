export abstract class Construct {
  protected children: Construct[] = [];

  constructor(scope?: Construct) {
    scope?.addChild(this);
  }

  protected addChild(construct: Construct) {
    this.children.push(construct);
  }

  protected abstract toSQL(): string;

  public synthesize(): string {
    return this.toSQL();
  }
}
