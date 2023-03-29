import { afterEach } from 'vitest'

import { ChakraProvider } from '@chakra-ui/react'
import { cleanup, render } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => <ChakraProvider>{children}</ChakraProvider>,
    ...options,
  })

export * from '@testing-library/react'
// override render export
export { customRender }
