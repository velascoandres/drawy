import { beforeEach, describe, expect, it, Mock } from 'vitest'

import userEvent from '@testing-library/user-event'

import ExportFile from '@/modals/ExportFile/ExportFile'
import { useUpdateDrawMutation } from '@/mutations/drawMutations'
import { useGetDrawByIdQuery } from '@/queries/drawQueries'
import useModalStore from '@/store/modal/modalStore'
import { customRender, waitFor } from '@/test-utils/custom-render'

import DrawPage from './DrawPage'

vi.mock('zustand')
vi.mock('react-router-dom', () => ({
  useParams: vi.fn().mockReturnValue({ drawId: '1' }),
}))

vi.mock('@/queries/drawQueries')
vi.mock('@/mutations/drawMutations')

const updateDrawMock = vi.fn()

const useGetDrawByIdQueryMock = useGetDrawByIdQuery as Mock
const useUpdateDrawMutationMock = useUpdateDrawMutation as Mock

describe('<DrawPage /> tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useGetDrawByIdQueryMock.mockReturnValue({ data: { id: '1', name: 'Draw name test' } })
    useUpdateDrawMutationMock.mockReturnValue({ mutate: updateDrawMock })
  })

  describe('When renders', () => { 
    it('should show export button', async () => {
      const { getByText } = customRender(<DrawPage />)
    
      await waitFor(() => {
        expect(getByText('Export')).toBeInTheDocument()
      })
    })

    it('should show open ExportFile modal', async () => {
      const { getByText } = customRender(<DrawPage />)

      await waitFor(async () => {
        await userEvent.click(getByText('Export'))
      })

      await waitFor(() => {
        expect(useModalStore.getState().isOpen).toBeTruthy()
        expect(useModalStore.getState().currentModal?.component).toStrictEqual(ExportFile) 
      })
    })

    it('should show draw name', async () => {
      const { getByText } = customRender(<DrawPage />)
    
      await waitFor(() => {
        expect(getByText('Draw name test')).toBeInTheDocument()
      })
    })
  })
})