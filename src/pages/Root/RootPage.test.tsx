import { describe, expect, it, Mock, vi } from 'vitest'

import userEvent from '@testing-library/user-event'

import ConfirmationContainer from '@/components/ConfirmationContainer/ConfirmationContainer'
import CreateDrawModal from '@/modals/CreateDraw/CreateDrawModal'
import { useDeleteDrawMutation } from '@/mutations/drawMutations'
import { useGetDrawsQuery } from '@/queries/drawQueries'
import useModalStore from '@/store/modal/modalStore'
import { customRender } from '@/test-utils/custom-render'

import RootPage from './RootPage'

const navigateMock = vi.fn()

vi.mock('zustand')
vi.mock('react-router-dom', () => ({
  Outlet: () => null,  
  useNavigate: () => navigateMock,
  useParams: () => vi.fn(),
}))

vi.mock('@/queries/drawQueries')
vi.mock('@/mutations/drawMutations')

const items = [
  { id: '1', name: 'draw 1' }, 
  { id: '2', name: 'draw 2' },
]

const deleteMock = vi.fn()

const useGetDrawsQueryMock = useGetDrawsQuery as Mock
const useDeleteDrawMutationMock = useDeleteDrawMutation as Mock

describe('<DrawList /> tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useGetDrawsQueryMock.mockReturnValue({ data: items })
    useDeleteDrawMutationMock.mockReturnValue({ mutate: deleteMock })
  })

  describe('When renders', () => {
    it.each(items)('shouls show a $name', ({ name }) => {
      const { getByText } = customRender(<RootPage />)

      expect(getByText(name)).toBeInTheDocument()
    })
  })

  describe('When click on draw name', () => {
    it('should call navigate to DrawPage', async () => {
      const { getByText } = customRender(<RootPage />)


      expect(getByText('draw 1')).toBeInTheDocument()

      await userEvent.click(getByText('draw 1'))

      expect(navigateMock).toHaveBeenCalledWith('/draw/1')
    })
  })

  describe('When click on Add draw', () => {
    it('should open the modal', async () => {
      const { getByText } = customRender(<RootPage />)

      await userEvent.click(getByText('Add draw'))

      expect(useModalStore.getState().isOpen).toBeTruthy()
      expect(useModalStore.getState().currentModal?.component).toStrictEqual(CreateDrawModal)
    })
  })

  describe('When click on Delete draw button', () => { 
    it('should call delete mutation', async () => {
      const { getAllByLabelText, getByText } = customRender(
        <>
          <ConfirmationContainer />
          <RootPage />
        </>
      )
      
      await userEvent.click(getAllByLabelText('delete-draw')[0])

      expect(getByText('Do you want to delete: draw 1?')).toBeInTheDocument()

      await userEvent.click(getByText('Confirm'))
      
      expect(deleteMock).toHaveBeenCalledWith('1')
    })
  })
})