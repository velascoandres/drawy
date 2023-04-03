import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import { ChakraProvider } from '@chakra-ui/react'

import ConfirmationContainer from '@/components/ConfirmationContainer/ConfirmationContainer'
import ModalContainer from '@/components/ModalContainer/ModalContainer'
import ROUTES from '@/constants/routes'

const router = createBrowserRouter(ROUTES)

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <RouterProvider router={router} />
        <ModalContainer />
        <ConfirmationContainer />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
