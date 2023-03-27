import { describe, expect, it, vi } from 'vitest'

import { customRender, fireEvent } from '@/test-utils/custom-render'

import RootPage from './RootPage'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  Outlet: () => null,  
  useNavigate: () => navigateMock,
}))

const items = [
  { id: '1', name: 'draw 1' }, 
  { id: '2', name: 'draw 2' },
]


describe('<DrawList /> tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('When renders', () => {
    it.each(items)('shouls show a $name', ({ name }) => {
      const { getByText } = customRender(<RootPage />)

      expect(getByText(name)).toBeInTheDocument()
    })
  })

  describe('When click on draw name', () => {
    it('should call navigate to DrawPage', () => {
      const { getByText } = customRender(<RootPage />)


      expect(getByText('draw 1')).toBeInTheDocument()

      fireEvent.click(getByText('draw 1'))

      expect(navigateMock).toHaveBeenCalledWith('/draw/1')
    })
  })
})