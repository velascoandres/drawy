import { describe, expect, it, Mock, vi } from 'vitest'

import CreateDrawModal from '@/modals/CreateDraw/CreateDrawModal'
import { useGetDrawsQuery } from '@/queries/drawQueries'
import useModalStore from '@/store/modal/modalStore'
import { customRender, fireEvent } from '@/test-utils/custom-render'

import RootPage from './RootPage'

const navigateMock = vi.fn()

vi.mock('zustand')
vi.mock('react-router-dom', () => ({
  Outlet: () => null,  
  useNavigate: () => navigateMock,
}))

vi.mock('@/queries/drawQueries')

const items = [
  { id: '1', name: 'draw 1' }, 
  { id: '2', name: 'draw 2' },
]


const useGetDrawsQueryMock = useGetDrawsQuery as Mock

describe('<DrawList /> tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useGetDrawsQueryMock.mockReturnValue({ data: items })
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