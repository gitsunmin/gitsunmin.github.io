/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as TilImport } from './routes/til'
import { Route as PortfolioImport } from './routes/portfolio'

// Create Virtual Routes

const InterviewLazyImport = createFileRoute('/interview')()
const CareersLazyImport = createFileRoute('/careers')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const InterviewLazyRoute = InterviewLazyImport.update({
  path: '/interview',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/interview.lazy').then((d) => d.Route))

const CareersLazyRoute = CareersLazyImport.update({
  path: '/careers',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/careers.lazy').then((d) => d.Route))

const TilRoute = TilImport.update({
  path: '/til',
  getParentRoute: () => rootRoute,
} as any)

const PortfolioRoute = PortfolioImport.update({
  path: '/portfolio',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/portfolio': {
      id: '/portfolio'
      path: '/portfolio'
      fullPath: '/portfolio'
      preLoaderRoute: typeof PortfolioImport
      parentRoute: typeof rootRoute
    }
    '/til': {
      id: '/til'
      path: '/til'
      fullPath: '/til'
      preLoaderRoute: typeof TilImport
      parentRoute: typeof rootRoute
    }
    '/careers': {
      id: '/careers'
      path: '/careers'
      fullPath: '/careers'
      preLoaderRoute: typeof CareersLazyImport
      parentRoute: typeof rootRoute
    }
    '/interview': {
      id: '/interview'
      path: '/interview'
      fullPath: '/interview'
      preLoaderRoute: typeof InterviewLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexLazyRoute,
  PortfolioRoute,
  TilRoute,
  CareersLazyRoute,
  InterviewLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/portfolio",
        "/til",
        "/careers",
        "/interview"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/portfolio": {
      "filePath": "portfolio.tsx"
    },
    "/til": {
      "filePath": "til.tsx"
    },
    "/careers": {
      "filePath": "careers.lazy.tsx"
    },
    "/interview": {
      "filePath": "interview.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
