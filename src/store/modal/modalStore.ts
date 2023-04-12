/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type IModalProps = { [key in string]: unknown }

interface IModalConfig {
    closeOnClickOutside: boolean
    closeOnEscapeKeydown: boolean
}

export interface IOpenModalArgs {
    component: React.FC<any>
    props?: IModalProps
    config?: IModalConfig
}

export interface IModalInfo {
    component: React.FC<any>
    componentProps?: IModalProps
    config?: IModalConfig
}

export interface IModalState {
    currentModal?: IModalInfo
    isOpen: boolean

    openModal: (args: IOpenModalArgs) => void
    closeModal: () => void
}

const INITIAL_MODAL_STATE: Omit<IModalState, 'openModal' | 'closeModal'> = {
  isOpen: false,
}

const useModalStore = create<IModalState>()(devtools((setStore) => ({
  ...INITIAL_MODAL_STATE,  
  openModal: (payload) => {
    setStore((state) => {
       
      return {
        ...state,
        currentModal: {
          component: payload.component,
          config: payload.config,
          componentProps: payload.props
        },
        isOpen: true,
      }
    })
  },
  closeModal: () => {
    setStore(() => {
       
      return {
        currentModal: undefined,
        isOpen: false,
      }
    })
  }
}), 
{ name: 'modal-storage' }
))


export default useModalStore