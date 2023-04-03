import { describe, expect, it, vi } from 'vitest'

import useConfirmationStore from '@/store/confirmation/confirmationStore'

vi.mock('zustand')


describe('useConfirmationStore tests', () => { 
  describe('When store inits', () => { 

    it('should return initial state', () => {
      const state = useConfirmationStore.getState()

      expect(state.isOpen).toBeFalsy()
      expect(state.confirmationProps).toBeFalsy()
    })
  })


  describe('When open a confirmation', () => { 
    it('should return a state with confirmation props ', () => {  
      useConfirmationStore.getState().openConfirmation({
        title: 'Confirm action?',
        content: <strong>Confirm the action</strong>,
        onConfirm: vi.fn()
      })
  
      const state = useConfirmationStore.getState()
  
      expect(state.isOpen).toBeTruthy()
      expect(state.confirmationProps?.title).toBe('Confirm action?')
      expect(state.confirmationProps?.content).toStrictEqual(<strong>Confirm the action</strong>)
      expect(state.confirmationProps?.onConfirm).toStrictEqual(expect.any(Function))
    })
  })

  describe('When close a modal', () => { 
    it('should return the initial state ', () => {
      const state = useConfirmationStore.getState()

      expect(state.isOpen).toBeFalsy()
      expect(state.confirmationProps).toBeFalsy()
    })
  })
})