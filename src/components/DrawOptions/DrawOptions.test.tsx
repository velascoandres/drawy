import { beforeEach, describe, it, Mock, vi } from 'vitest'

import userEvent from '@testing-library/user-event'

import CreateUpdateDrawModal from '@/modals/CreateUpdateDraw/CreateUpdateDrawModal'
import { useDeleteDrawMutation } from '@/mutations/drawMutations'
import useModalStore from '@/store/modal/modalStore'
import { customRender } from '@/test-utils/custom-render'

import ConfirmationContainer from '../ConfirmationContainer/ConfirmationContainer'

import DrawOptions from './DrawOptions'

const drawInfo = { id: '1', name: 'draw 1' }

vi.mock('@/mutations/drawMutations')

const deleteMock = vi.fn()
const navigateMock = vi.fn()

const useDeleteDrawMutationMock = useDeleteDrawMutation as Mock

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

describe('<DrawOptions /> tests', () => { 
  beforeEach(() => {
    vi.clearAllMocks()
    useDeleteDrawMutationMock.mockReturnValue({ mutate: deleteMock })
  })

  describe('When renders', () => { 
    it('should show the options', () => {
      const { getByLabelText } = customRender(
        <>
          <ConfirmationContainer />
          <DrawOptions isOpen draw={drawInfo} />
        </>
      )
  
      expect(getByLabelText('remove')).toBeInTheDocument()
      expect(getByLabelText('information')).toBeInTheDocument()
    }) 
  })

  describe('When click on "Delete" draw button', () => { 
    it('should call delete mutation', async () => {
      const { getByLabelText, getByText } = customRender(
        <>
          <ConfirmationContainer />
          <DrawOptions isOpen draw={drawInfo} />
        </>
      )
          
      await userEvent.click(getByLabelText('options'))
      await userEvent.click(getByLabelText('remove'))
    
      expect(getByText('Do you want to delete: draw 1?')).toBeInTheDocument()
    
      await userEvent.click(getByText('Confirm'))
          
      expect(deleteMock).toHaveBeenCalledWith('1', { onSuccess: expect.any(Function) })
    })
  })
    
  describe('When click on "Information" draw button', () => { 
    it('should open the modal', async () => {
      const { getByLabelText } = customRender(<DrawOptions isOpen draw={drawInfo} />)
          
      await userEvent.click(getByLabelText('options'))
      await userEvent.click(getByLabelText('information'))
    
      expect(useModalStore.getState().isOpen).toBeTruthy()
      expect(useModalStore.getState().currentModal?.component).toStrictEqual(CreateUpdateDrawModal)
    })
  })
})