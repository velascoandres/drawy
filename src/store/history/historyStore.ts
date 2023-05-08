/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import type { IDrawInfo } from '@/services/drawService'

export interface IHistoryStore {
  drawInfo?: IDrawInfo
  currentPage: number

  selectDraw: (draw: IDrawInfo) => void
  setPage: (page: number) => void
  clearSelection: () => void
}

const INITIAL_STATE: Omit<IHistoryStore, 'selectDraw' | 'setPage' | 'clearSelection'> = {
  currentPage: 1,
  drawInfo: undefined
}

const useHistoryStore = create<IHistoryStore>()(devtools((setStore) => ({
  ...INITIAL_STATE,  
  selectDraw: (payload) => {
    setStore((state) => {
      return {
        ...state,
        drawInfo: payload
      }
    })
  },
  setPage: (payload) => {
    setStore((state) => {
      return {
        ...state,
        currentPage: payload
      }
    })
  },
  clearSelection: () => {
    setStore((state) => {
      return {
        ...state,
        drawInfo: undefined
      }
    })
  }
}), 
{ name: 'history-storage' }
))


export default useHistoryStore