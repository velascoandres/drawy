import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'

const RootPage = lazy(() => import('@/pages/Root/RootPage'))
const DrawPage = lazy(() => import('@/pages/Draw/DrawPage'))


const ROUTES: Record<string, RouteObject> = {
  root: {
    path: '/',
    element: <Suspense><RootPage /></Suspense>,
    children: [
      {
        path: 'draw/:drawId',
        element: <Suspense><DrawPage /></Suspense>
      }
    ],
  }
}


export default Object.values(ROUTES)