import RouteBuilder, { CanGoBackToCloseDrawer } from './routeBuilder';

export { CanGoBackToCloseDrawer };

export default {
  // Anonymous
  about: new RouteBuilder('/about').build(),

  // User
  games: new RouteBuilder('/games').build(),

  // InGame
  overview: new RouteBuilder('/overview').build(),
  galaxy: new RouteBuilder('/galaxy')
    .withSidebar(
      'system',
      new RouteBuilder<{ id: string }>('/system/:id', CanGoBackToCloseDrawer)
        .withSidebar('build', new RouteBuilder('/build').build())
        .build(),
    )
    .build(),
};
