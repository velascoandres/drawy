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

import '@/styles/main.css'

const router = createBrowserRouter(ROUTES)

const queryClient = new QueryClient()

const disableContextMenu = () => {
  if (window.location.hostname !== 'tauri.localhost') {
    return
  }
  document.addEventListener('contextmenu', event => event.preventDefault())
}

disableContextMenu()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <RouterProvider router={router} />
        <ModalContainer />
        <ConfirmationContainer />
      </ChakraProvider>
    </QueryClientProvider>
  </>,
)
