import * as pathToRegexp from 'path-to-regexp';
import { LocationDescriptorObject } from 'history';

export const CanGoBackToCloseDrawer = '@@CanGoBackToCloseDrawer';

class RouteConfig<TLink = unknown, TSidebar = unknown> {
  constructor(
    private _pathname: string,
    public readonly sidebars: TSidebar,
    public readonly parent: RouteConfig | null,
  ) {
    Object.values(this.sidebars).forEach(route => (route.parent = this));
  }

  public get pathname(): string {
    return (this.parent ? this.parent.pathname : '') + this._pathname;
  }

  public get sidebarPathnames() {
    return Object.values(this.sidebars).map(route => route.pathname as string);
  }

  matchingConfig(pathname: string): RouteConfig | undefined {
    const sidebarMatch = Object.values(this.sidebars)
      .map(route => route.matchingConfig(pathname))
      .find(Boolean);
    return sidebarMatch || (pathToRegexp(this.pathname).exec(pathname) && this);
  }

  link<S = {}>(
    args?: TLink extends {} ? TLink : S,
    state?: S,
  ): LocationDescriptorObject {
    return {
      pathname: pathToRegexp.compile(this.pathname)(args as TLink),
      state,
    };
  }
}

export default class RouteBuilder<
  TLink,
  TSidebar extends { [key: string]: RouteConfig } = {}
> {
  sidebars: TSidebar = {} as TSidebar;

  constructor(private pathname: string) {}

  withSidebar<K extends string, L, S>(
    key: K,
    config: RouteConfig<L, S>,
  ): RouteBuilder<TLink, TSidebar & { [P in K]: RouteConfig<TLink & L, S> }> {
    Object.assign(this.sidebars, { [key]: config });
    return this as RouteBuilder<
      TLink,
      TSidebar & { [P in K]: RouteConfig<TLink & L, S> }
    >;
  }

  build() {
    return new RouteConfig<TLink, TSidebar>(this.pathname, this.sidebars, null);
  }
}
