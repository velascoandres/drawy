import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import { ChakraProvider } from '@chakra-ui/react'

import ModalContainer from '@/components/ModalContainer/ModalContainer'
import ROUTES from '@/constants/routes'

const router = createBrowserRouter(ROUTES)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
      <ModalContainer />
    </ChakraProvider>
  </React.StrictMode>,
)
