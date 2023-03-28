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

  React.useEffect(() => {
    const hasCloseOnEscapeKeydown = currentModal?.config?.closeOnEscapeKeydown

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return 
      }
      
      if (!hasCloseOnEscapeKeydown) {
        return
      }

      closeModal()
    }

    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }

  }, [closeModal, currentModal])

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={closeModal} 
      closeOnOverlayClick={currentModal?.config?.closeOnClickOutside}
    >
      <ModalOverlay />
      {renderModal()}
    </Modal>
  )
}

export default ModalContainer