import { describe, expect, it, vi } from 'vitest'

import useHistoryStore from '@/store/history/historyStore'

vi.mock('zustand')

describe('useHistoryStore tests', () => { 
  describe('When store inits', () => { 
    it('should return inital state values', () => {
      const state = useHistoryStore.getState()

      expect(state.currentPage).toBe(1)
      expect(state.drawInfo).toBeUndefined()
    })
  })
  describe('When set page', () => { 
    it('should return the updated page value', () => {
      useHistoryStore.getState().setPage(10)

      const state = useHistoryStore.getState()

      expect(state.currentPage).toBe(10)
      expect(state.drawInfo).toBeUndefined()
    })
  })
  describe('When select a draw information', () => { 
    it('should return the selected draw information', () => {
      useHistoryStore.getState().selectDraw({
        id: '1',
        name: 'test draw',
      })

      const state = useHistoryStore.getState()

      expect(state.currentPage).toBe(1)
      expect(state.drawInfo).toMatchObject({
        id: '1',
        name: 'test draw',
      })
    })
  })

  describe('When clear selection', () => { 
    it('should return the initial draw information value', () => {
      useHistoryStore.getState().selectDraw({
        id: '1',
        name: 'test draw',
      })

      let state = useHistoryStore.getState()

      expect(state.drawInfo).toMatchObject({
        id: '1',
        name: 'test draw',
      })

      useHistoryStore.getState().clearSelection()

      state = useHistoryStore.getState()

      expect(state.currentPage).toBe(1)
      expect(state.drawInfo).toBeUndefined()
    })
  })
})