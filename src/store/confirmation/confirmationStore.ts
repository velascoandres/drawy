/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'


export interface IOpenConfirmationArgs {
    title: React.ReactNode
    content: React.ReactNode
    onConfirm: () => void
}

export interface IConfirmationState {
    isOpen: boolean
    confirmationProps?: IOpenConfirmationArgs

    openConfirmation: (args: IOpenConfirmationArgs) => void
    closeConfirmation: () => void
}

const INITIAL_STATE: Omit<IConfirmationState, 'openConfirmation' | 'closeConfirmation'> = {
  isOpen: false,
}

const useConfirmationStore = create<IConfirmationState>()(devtools((setStore) => ({
  ...INITIAL_STATE,  
  openConfirmation: (payload) => {
    setStore((state) => {
       
      return {
        ...state,
        confirmationProps: payload,
        isOpen: true,
      }
    })
  },
  closeConfirmation: () => {
    setStore(() => {
       
      return {
        confirmationProps: undefined,
        isOpen: false,
      }
    })
  }
}), 
{ name: 'confirmation-storage' }
))


export default useConfirmationStore