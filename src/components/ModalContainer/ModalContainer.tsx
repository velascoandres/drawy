import React from 'react'

import { Modal, ModalOverlay } from '@chakra-ui/react'

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
    <Modal 
      isOpen={isOpen} 
      onClose={closeModal}
      closeOnEsc={currentModal?.config?.closeOnEscapeKeydown}
      closeOnOverlayClick={currentModal?.config?.closeOnClickOutside}
      size="2xl"
    >
      <ModalOverlay aria-label="overlay" />
      {renderModal()}
    </Modal>
  )
}

export default ModalContainer