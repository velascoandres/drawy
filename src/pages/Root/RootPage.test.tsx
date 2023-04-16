import { useIsFetching, useIsMutating } from 'react-query'
import { describe, expect, it, Mock, vi } from 'vitest'

import userEvent from '@testing-library/user-event'

import ConfirmationContainer from '@/components/ConfirmationContainer/ConfirmationContainer'
import CreateUpdateDrawModal from '@/modals/CreateUpdateDraw/CreateUpdateDrawModal'
import { useDeleteDrawMutation } from '@/mutations/drawMutations'
import { useGetDrawsInfoQuery } from '@/queries/drawQueries'
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
vi.mock('react-query')

const items = [
  { id: '1', name: 'draw 1' }, 
  { id: '2', name: 'draw 2' },
]

const deleteMock = vi.fn()

const useGetDrawsInfoQueryMock = useGetDrawsInfoQuery as Mock
const useDeleteDrawMutationMock = useDeleteDrawMutation as Mock
const isFetchingMock = useIsFetching as Mock
const isMutatingMock = useIsMutating as Mock

describe('<RootPage /> tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useGetDrawsInfoQueryMock.mockReturnValue({ data: { results: items, count: items.length } })
    useDeleteDrawMutationMock.mockReturnValue({ mutate: deleteMock })
    isFetchingMock.mockReturnValue(0)
    isMutatingMock.mockReturnValue(0)
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
      expect(useModalStore.getState().currentModal?.component).toStrictEqual(CreateUpdateDrawModal)
    })
  })

  describe('When click on "Delete" draw button', () => { 
    it('should call delete mutation', async () => {
      const { getAllByLabelText, getByText } = customRender(
        <>
          <ConfirmationContainer />
          <RootPage />
        </>
      )
      
      await userEvent.click(getAllByLabelText('options')[0])

      await userEvent.click(getAllByLabelText('remove')[0])

      expect(getByText('Do you want to delete: draw 1?')).toBeInTheDocument()

      await userEvent.click(getByText('Confirm'))
      
      expect(deleteMock).toHaveBeenCalledWith('1')
    })
  })

  describe('When click on "Information" draw button', () => { 
    it('should open the modal', async () => {
      const { getAllByLabelText, getByText } = customRender(<RootPage />)
      
      await userEvent.click(getAllByLabelText('options')[0])

      await userEvent.click(getAllByLabelText('info')[0])

      expect(useModalStore.getState().isOpen).toBeTruthy()
      expect(useModalStore.getState().currentModal?.component).toStrictEqual(CreateUpdateDrawModal)
    })
  })
})