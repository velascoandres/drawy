import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'

import Loader from '@/components/Loader/Loader'

const RootPage = lazy(() => import('@/pages/Root/RootPage'))
const DrawPage = lazy(() => import('@/pages/Draw/DrawPage'))


const ROUTES: Record<string, RouteObject> = {
  root: {
    path: '/',
    element: <Suspense fallback={<Loader />}><RootPage /></Suspense>,
    children: [
      {
        path: 'draw/:drawId',
        element: <Suspense fallback={<Loader />}><DrawPage /></Suspense>
      }
    ],
  }
}


export default Object.values(ROUTES)