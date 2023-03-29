import { describe, expect, it, vi } from 'vitest'

import CreateDrawModal from '@/modals/CreateDraw/CreateDrawModal'
import useModalStore from '@/store/modal/modalStore'
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

  describe('When click on Add draw', () => {
    it('should open the modal', () => {
      const { getByText } = customRender(<RootPage />)


      fireEvent.click(getByText('Add draw'))

      expect(useModalStore.getState().isOpen).toBeTruthy()
      expect(useModalStore.getState().currentModal?.component).toStrictEqual(CreateDrawModal)
    })
  })
})