import React from 'react'

import { Drawer, DrawerOverlay } from '@chakra-ui/react'

import useModalStore from '@/store/modal/modalStore'

const ModalContainer = () => {
  const { currentModal, isOpen, closeModal } = useModalStore()


  const renderModal = () => {
    if (!currentModal) {
      return null
    }

    const { component, componentProps } = currentModal

    if (!component) {
      return null
    }

    const ModalComponent = component

    return <ModalComponent {...componentProps } />
  }

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={closeModal}
      closeOnEsc={currentModal?.config?.closeOnEscapeKeydown}
      closeOnOverlayClick={currentModal?.config?.closeOnClickOutside}
      size={currentModal?.config?.size || 'md'}
    >
      <DrawerOverlay aria-label="overlay" />
      {renderModal()}
    </Drawer>
  )
}

export default ModalContainer