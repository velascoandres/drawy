import { beforeEach, describe, expect, it, Mock } from 'vitest'

import userEvent from '@testing-library/user-event'

import { useUpdateDrawMutation } from '@/mutations/drawMutations'
import { useGetDrawByIdQuery } from '@/queries/drawQueries'
import { customRender } from '@/test-utils/custom-render'

import DrawPage from './DrawPage'

vi.mock('zustand')
vi.mock('react-router-dom', () => ({
  useParams: vi.fn().mockReturnValue({ drawId: '1' }),
}))

vi.mock('@/queries/drawQueries')
vi.mock('@/mutations/drawMutations')

vi.mock('@excalidraw/excalidraw', () => ({
  Excalidraw: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

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
    it('should show draw name', () => {
      const { getByText } = customRender(<DrawPage />)
    
      expect(getByText('Draw name test')).toBeInTheDocument()
    })
  })

  describe('When update the draw name', () => { 
    it('should call update mutation', async () => {
      const { getByDisplayValue, getByLabelText, getByText } = customRender(<DrawPage />)
        
      
      await userEvent.click(getByText('Draw name test'))
      await userEvent.type(getByDisplayValue('Draw name test'), ' update 2')
      await userEvent.click(getByLabelText('confirm-update'))

      expect(updateDrawMock).toHaveBeenCalledWith({ id: '1', name: 'Draw name test update 2' })
    })

    it('should not call update mutation if cancel update', async () => {
      const { getByDisplayValue, getByLabelText, getByText } = customRender(<DrawPage />)
          
        
      await userEvent.click(getByText('Draw name test'))
      await userEvent.type(getByDisplayValue('Draw name test'), ' update 2')
      await userEvent.click(getByLabelText('cancel-update'))
  
      expect(updateDrawMock).not.toHaveBeenCalled()
      expect(getByText('Draw name test')).toBeInTheDocument()
    })
  })
})