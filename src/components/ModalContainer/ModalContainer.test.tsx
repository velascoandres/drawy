/* eslint-disable @typescript-eslint/no-explicit-any */
import { it, vi } from 'vitest'

import useModalStore from '@/store/modal/modalStore'
import { customRender } from '@/test-utils/custom-render'

import ModalContainer from './ModalContainer'

vi.mock('zustand')

const mockModalSimpleModal = {
  component: () => <div>Mock Modal</div>,
  componentProps: {}
}

describe('<ModalContainer /> tests', () => {     
  it('should show a modal content', () => {
    const mockModalStore = {
      currentModal: mockModalSimpleModal,
      isOpen: true,
    }
            
    useModalStore.setState(mockModalStore)
            
    const { getByText } = customRender(<ModalContainer />)
            
            
    expect(getByText('Mock Modal')).toBeInTheDocument()
  })
    

  it('should not show anything if isOpen is false', () => {
    const mockModalStore = {
      currentModal: mockModalSimpleModal,
      isOpen: false,
    }
            
    useModalStore.setState(mockModalStore)
            
    const { queryByText } = customRender(<ModalContainer />)
            
    expect(queryByText('Mock Modal')).not.toBeInTheDocument()
  })
})