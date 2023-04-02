import { describe, Mock, vi } from 'vitest'

import userEvent from '@testing-library/user-event'

import { useCreateDrawMutation } from '@/mutations/drawMutations'
import * as modalStore from '@/store/modal/modalStore'
import { customRenderModal } from '@/test-utils/custom-render'

import CreateDrawModal from './CreateDrawModal'


vi.mock('@/mutations/drawMutations')
vi.mock('@/store/modal/modalStore')


const useCreateDrawMutationMock = useCreateDrawMutation as Mock
const useModalStoreMock = modalStore.default as unknown as Mock

const createMock = vi.fn()
const closeModalMock = vi.fn()


describe('<CreateDrawModal /> tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    useCreateDrawMutationMock.mockReturnValue({
      mutate: createMock
    })
    useModalStoreMock.mockReturnValue({
      closeModal: closeModalMock,
    })

  })

  describe('When renders', () => {
    it('should show modal content', () => {
      const { getByLabelText, getByPlaceholderText, getByText } = customRenderModal(<CreateDrawModal />)
    
      expect(getByText('Create a new Draw')).toBeInTheDocument()
      expect(getByLabelText('Draw name')).toBeInTheDocument()
      expect(getByPlaceholderText('Write a name for your draw')).toBeInTheDocument()
    })
  })

  describe('When create a draw', () => { 
    it('should call createMock mutation', async () => {
      const { getByPlaceholderText, getByText } = customRenderModal(<CreateDrawModal />)
      
      await userEvent.type(getByPlaceholderText('Write a name for your draw'), 'Test draw name')
      await userEvent.click(getByText('Create'))
      
      expect(createMock).toHaveBeenCalledWith({
        name: 'Test draw name'
      })
    })
  })

  describe('When create is success', () => { 
    beforeEach(() => {    
      useCreateDrawMutationMock.mockReturnValue({
        mutate: vi.fn(),
        isSuccess: true,
      })
    })


    it('should call closeModal', () => {
      customRenderModal(<CreateDrawModal />)
        
      expect(closeModalMock).toBeCalled()
    })
  })
})