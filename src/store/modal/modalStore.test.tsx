import { describe, expect, it, vi } from 'vitest'

import useModalStore from '@/store/modal/modalStore'

vi.mock('zustand')

const mockModal = () => <div>modal mock</div>


describe('useModalStore tests', () => { 
  describe('When store inits', () => { 

    it('should return initial state', () => {
      const state = useModalStore.getState()

      expect(state.isOpen).toBeFalsy()
      expect(state.currentModal).toBeFalsy()
    })
  })


  describe('When open a modal', () => { 
    it('should return a state with a modal component ', () => {  
      useModalStore.getState().openModal({
        component: mockModal,
      })
  
      const state = useModalStore.getState()
  
      expect(state.isOpen).toBeTruthy()
      expect(state.currentModal?.component).toStrictEqual(mockModal)
    })
  })

  describe('When close a modal', () => { 
    it('should return the initial state ', () => {
      useModalStore.setState({
        currentModal: {
          component: mockModal,
        },
        isOpen: false,
      })

      useModalStore.getState().closeModal()

      const state = useModalStore.getState()

      expect(state.isOpen).toBeFalsy()
      expect(state.currentModal).toBeFalsy()
    })
  })
})