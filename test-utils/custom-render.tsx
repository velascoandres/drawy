import { afterEach, vi } from 'vitest'

import { ChakraProvider, Modal } from '@chakra-ui/react'
import { cleanup, render } from '@testing-library/react'

import ConfirmationContainer from '@/components/ConfirmationContainer/ConfirmationContainer'

afterEach(() => {
  cleanup()
})

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    wrapper: ({ children }) => (
      <ChakraProvider>
        <ConfirmationContainer />
        {children}
      </ChakraProvider>
    ),
    ...options,
  })

const customRenderModal = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    wrapper: ({ children }) => <ChakraProvider><Modal isOpen onClose={vi.fn()}> {children} </Modal></ChakraProvider>,
    ...options,
  })

export * from '@testing-library/react'
// override render export
export { customRender, customRenderModal }
