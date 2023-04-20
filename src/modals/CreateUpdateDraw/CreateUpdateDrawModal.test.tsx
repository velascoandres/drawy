import { describe, Mock, vi } from 'vitest'

import userEvent from '@testing-library/user-event'

import { useCreateDrawMutation, useUpdateDrawMutation } from '@/mutations/drawMutations'
import * as modalStore from '@/store/modal/modalStore'
import { customRenderModal } from '@/test-utils/custom-render'

import CreateDrawModal from './CreateUpdateDrawModal'


vi.mock('@/mutations/drawMutations')
vi.mock('@/store/modal/modalStore')


const useCreateDrawMutationMock = useCreateDrawMutation as Mock
const useUpdateDrawMutationMock = useUpdateDrawMutation as Mock
const useModalStoreMock = modalStore.default as unknown as Mock

const createMock = vi.fn()
const updateMock = vi.fn()
const closeModalMock = vi.fn()

const draw = {
  id: '1',
  name: 'Draw 1',
  description: 'draw description',
}


describe('<CreateDrawModal /> tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    useCreateDrawMutationMock.mockReturnValue({
      mutate: createMock
    })
    useModalStoreMock.mockReturnValue({
      closeModal: closeModalMock,
    })

    useUpdateDrawMutationMock.mockReturnValue({
      mutate: updateMock
    })
  })

  describe('When renders', () => {
    it('should show modal content', () => {
      const { getByLabelText, getByPlaceholderText, getByText } = customRenderModal(<CreateDrawModal />)
    
      expect(getByText('Create a new Draw')).toBeInTheDocument()
      expect(getByLabelText('Name')).toBeInTheDocument()
      expect(getByLabelText('Description')).toBeInTheDocument()
      expect(getByPlaceholderText('Write a name for your draw')).toBeInTheDocument()
      expect(getByPlaceholderText('Write a full description for your draw')).toBeInTheDocument()
    })
  })

  describe('When create a draw', () => { 
    it('should call createMock mutation', async () => {
      const { getByPlaceholderText, getByText } = customRenderModal(<CreateDrawModal />)
      
      await userEvent.type(getByPlaceholderText('Write a name for your draw'), 'Test draw name')
      await userEvent.type(getByPlaceholderText('Write a full description for your draw'), 'Some description')
      
      await userEvent.click(getByText('Create'))
      
      expect(createMock).toHaveBeenCalledWith({
        name: 'Test draw name',
        description: 'Some description',
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

  describe('When renders with a draw', () => { 
    it('should show a draw edit form', async () => {
      const { getByText, getByLabelText, queryByText, getByDisplayValue } = customRenderModal(<CreateDrawModal draw={draw} />)

      expect(getByText('Draw information')).toBeInTheDocument()

      await userEvent.click(getByLabelText('toogle-edit'))

      expect(getByText('Edit Draw')).toBeInTheDocument()

      expect(queryByText('Draw information')).not.toBeInTheDocument()

      expect(getByDisplayValue('Draw 1')).toBeInTheDocument()
      expect(getByDisplayValue('draw description')).toBeInTheDocument()
    })

    it('should call edit mutation', async () => {
      const { getByText, getByLabelText, getByDisplayValue } = customRenderModal(<CreateDrawModal draw={draw} />)

      await userEvent.click(getByLabelText('toogle-edit'))

      await userEvent.type(getByDisplayValue('Draw 1'), '{backspace}2 edited!')
      await userEvent.type(getByDisplayValue('draw description'), '{backspace}{backspace}')

      await userEvent.click(getByText('Update'))

      expect(updateMock).toHaveBeenCalledWith({
        id: '1',
        name: 'Draw 2 edited!',
        description: 'draw descripti'
      })
    })
  })

  describe('When update is success', () => { 
    beforeEach(() => {    
      useUpdateDrawMutationMock.mockReturnValue({
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