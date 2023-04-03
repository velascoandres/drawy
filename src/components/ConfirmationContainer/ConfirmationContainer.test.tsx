/* eslint-disable @typescript-eslint/no-explicit-any */
import { it, vi } from 'vitest'

import userEvent from '@testing-library/user-event'

import confirmationStore from '@/store/confirmation/confirmationStore'
import { customRender } from '@/test-utils/custom-render'

import ConfirmationContainer from './ConfirmationContainer'

vi.mock('zustand')

describe('<ModalContainer /> tests', () => {     
  it('should show the confirmation content', () => {
    confirmationStore.setState({
      isOpen: true,
      confirmationProps: {
        title: 'Some title',
        content: 'Some content',
        onConfirm: vi.fn()
      }
    })
            
    const { getByText } = customRender(<ConfirmationContainer />)
            
            
    expect(getByText('Some title')).toBeInTheDocument()
    expect(getByText('Some content')).toBeInTheDocument()
  })
    

  it('should not show anything if isOpen is false', () => {
    confirmationStore.setState({
      isOpen: false,
      confirmationProps: {
        title: 'Some title',
        content: 'Some content',
        onConfirm: vi.fn()
      }
    })
            
    const { queryByText } = customRender(<ConfirmationContainer />)
            
    expect(queryByText('Some title')).not.toBeInTheDocument()
    expect(queryByText('Some content')).not.toBeInTheDocument()
  })

  it('should call on confirm', async () => {
    const onConfirmMock = vi.fn()

    confirmationStore.setState({
      isOpen: true,
      confirmationProps: {
        title: 'Some title',
        content: 'Some content',
        onConfirm: onConfirmMock
      }
    })
            
    const { getByText } = customRender(<ConfirmationContainer />)
            

    await userEvent.click(getByText('Confirm'))

    expect(onConfirmMock).toBeCalled()
  })
})