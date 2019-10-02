import RouteBuilder from './routeBuilder';

export { CanGoBackToCloseDrawer } from './routeBuilder';

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
      new RouteBuilder<{ id: string }>('/system/:id')
        .withSidebar('build', new RouteBuilder('/build').build())
        .build(),
    )
    .build(),
};
