/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DashboardImport } from './routes/_dashboard'
import { Route as DashboardIndexImport } from './routes/_dashboard/index'
import { Route as DashboardSigninImport } from './routes/_dashboard/signin'
import { Route as DashboardLearnImport } from './routes/_dashboard/learn'
import { Route as DashboardFeaturesImport } from './routes/_dashboard/features'
import { Route as DashboardGamesIndexImport } from './routes/_dashboard/games/index'

// Create Virtual Routes

const GamesIdLazyImport = createFileRoute('/games/$id')()

// Create/Update Routes

const DashboardRoute = DashboardImport.update({
  id: '/_dashboard',
  getParentRoute: () => rootRoute,
} as any)

const DashboardIndexRoute = DashboardIndexImport.update({
  path: '/',
  getParentRoute: () => DashboardRoute,
} as any)

const GamesIdLazyRoute = GamesIdLazyImport.update({
  path: '/games/$id',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/games/$id.lazy').then((d) => d.Route))

const DashboardSigninRoute = DashboardSigninImport.update({
  path: '/signin',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardLearnRoute = DashboardLearnImport.update({
  path: '/learn',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardFeaturesRoute = DashboardFeaturesImport.update({
  path: '/features',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardGamesIndexRoute = DashboardGamesIndexImport.update({
  path: '/games/',
  getParentRoute: () => DashboardRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_dashboard': {
      id: '/_dashboard'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/_dashboard/features': {
      id: '/_dashboard/features'
      path: '/features'
      fullPath: '/features'
      preLoaderRoute: typeof DashboardFeaturesImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/learn': {
      id: '/_dashboard/learn'
      path: '/learn'
      fullPath: '/learn'
      preLoaderRoute: typeof DashboardLearnImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/signin': {
      id: '/_dashboard/signin'
      path: '/signin'
      fullPath: '/signin'
      preLoaderRoute: typeof DashboardSigninImport
      parentRoute: typeof DashboardImport
    }
    '/games/$id': {
      id: '/games/$id'
      path: '/games/$id'
      fullPath: '/games/$id'
      preLoaderRoute: typeof GamesIdLazyImport
      parentRoute: typeof rootRoute
    }
    '/_dashboard/': {
      id: '/_dashboard/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof DashboardIndexImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/games/': {
      id: '/_dashboard/games/'
      path: '/games'
      fullPath: '/games'
      preLoaderRoute: typeof DashboardGamesIndexImport
      parentRoute: typeof DashboardImport
    }
  }
}

// Create and export the route tree

interface DashboardRouteChildren {
  DashboardFeaturesRoute: typeof DashboardFeaturesRoute
  DashboardLearnRoute: typeof DashboardLearnRoute
  DashboardSigninRoute: typeof DashboardSigninRoute
  DashboardIndexRoute: typeof DashboardIndexRoute
  DashboardGamesIndexRoute: typeof DashboardGamesIndexRoute
}

const DashboardRouteChildren: DashboardRouteChildren = {
  DashboardFeaturesRoute: DashboardFeaturesRoute,
  DashboardLearnRoute: DashboardLearnRoute,
  DashboardSigninRoute: DashboardSigninRoute,
  DashboardIndexRoute: DashboardIndexRoute,
  DashboardGamesIndexRoute: DashboardGamesIndexRoute,
}

const DashboardRouteWithChildren = DashboardRoute._addFileChildren(
  DashboardRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof DashboardRouteWithChildren
  '/features': typeof DashboardFeaturesRoute
  '/learn': typeof DashboardLearnRoute
  '/signin': typeof DashboardSigninRoute
  '/games/$id': typeof GamesIdLazyRoute
  '/': typeof DashboardIndexRoute
  '/games': typeof DashboardGamesIndexRoute
}

export interface FileRoutesByTo {
  '/features': typeof DashboardFeaturesRoute
  '/learn': typeof DashboardLearnRoute
  '/signin': typeof DashboardSigninRoute
  '/games/$id': typeof GamesIdLazyRoute
  '/': typeof DashboardIndexRoute
  '/games': typeof DashboardGamesIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_dashboard': typeof DashboardRouteWithChildren
  '/_dashboard/features': typeof DashboardFeaturesRoute
  '/_dashboard/learn': typeof DashboardLearnRoute
  '/_dashboard/signin': typeof DashboardSigninRoute
  '/games/$id': typeof GamesIdLazyRoute
  '/_dashboard/': typeof DashboardIndexRoute
  '/_dashboard/games/': typeof DashboardGamesIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/features'
    | '/learn'
    | '/signin'
    | '/games/$id'
    | '/'
    | '/games'
  fileRoutesByTo: FileRoutesByTo
  to: '/features' | '/learn' | '/signin' | '/games/$id' | '/' | '/games'
  id:
    | '__root__'
    | '/_dashboard'
    | '/_dashboard/features'
    | '/_dashboard/learn'
    | '/_dashboard/signin'
    | '/games/$id'
    | '/_dashboard/'
    | '/_dashboard/games/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  DashboardRoute: typeof DashboardRouteWithChildren
  GamesIdLazyRoute: typeof GamesIdLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  DashboardRoute: DashboardRouteWithChildren,
  GamesIdLazyRoute: GamesIdLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_dashboard",
        "/games/$id"
      ]
    },
    "/_dashboard": {
      "filePath": "_dashboard.tsx",
      "children": [
        "/_dashboard/features",
        "/_dashboard/learn",
        "/_dashboard/signin",
        "/_dashboard/",
        "/_dashboard/games/"
      ]
    },
    "/_dashboard/features": {
      "filePath": "_dashboard/features.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/learn": {
      "filePath": "_dashboard/learn.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/signin": {
      "filePath": "_dashboard/signin.tsx",
      "parent": "/_dashboard"
    },
    "/games/$id": {
      "filePath": "games/$id.lazy.tsx"
    },
    "/_dashboard/": {
      "filePath": "_dashboard/index.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/games/": {
      "filePath": "_dashboard/games/index.tsx",
      "parent": "/_dashboard"
    }
  }
}
ROUTE_MANIFEST_END */