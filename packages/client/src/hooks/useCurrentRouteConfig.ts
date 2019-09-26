import routes from '../config/routing';
import useStore from './useStore';

export default function useCurrentRouteConfig() {
  return useStore(store =>
    Object.values(routes)
      .map(route => route.matchingConfig(store.routing.location.pathname))
      .find(Boolean),
  );
}
