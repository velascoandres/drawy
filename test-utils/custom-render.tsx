import { afterEach, vi } from 'vitest'

import { ChakraProvider, Drawer } from '@chakra-ui/react'
import { cleanup, render } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    wrapper: ({ children }) => (
      <ChakraProvider>
        {children}
      </ChakraProvider>
    ),
    ...options,
  })

const customRenderModal = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    wrapper: ({ children }) => <ChakraProvider><Drawer isOpen onClose={vi.fn()}> {children} </Drawer></ChakraProvider>,
    ...options,
  })  

export * from '@testing-library/react'
// override render export
export { customRender, customRenderModal }
