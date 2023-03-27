import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const RootPage = lazy(() => import('@/pages/Root/RootPage'))
const DrawPage = lazy(() => import('@/pages/Draw/DrawPage'))


const ROUTES: Record<string, RouteObject> = {
  root: {
    path: '/',
    element: <RootPage />,
    children: [
      {
        path: 'draw/:drawId',
        element: <DrawPage />
      }
    ],
  }
}


export default Object.values(ROUTES)