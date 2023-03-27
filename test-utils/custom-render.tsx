import { afterEach } from 'vitest'

import { cleanup, render } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options,
  })

export * from '@testing-library/react'
// override render export
export { customRender }
