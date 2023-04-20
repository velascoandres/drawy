import React from 'react'

import { 
  AlertDialog, 
  AlertDialogBody, 
  AlertDialogContent, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogOverlay, 
  Button 
} from '@chakra-ui/react'

import useConfirmationStore from '@/store/confirmation/confirmationStore'

const ConfirmationContainer = () => {
  const { isOpen, confirmationProps, closeConfirmation } = useConfirmationStore()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cancelRef = React.useRef<any>(null)

  const handleConfirm = () => {
    confirmationProps?.onConfirm()
    closeConfirmation()
  }  

  return (
    <AlertDialog 
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={closeConfirmation}
      isCentered
    >

      {confirmationProps && (
        <AlertDialogOverlay 
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(90deg)'
        >
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {confirmationProps.title}
            </AlertDialogHeader>

            <AlertDialogBody>
              {confirmationProps.content}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeConfirmation}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleConfirm} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      ) }
    </AlertDialog>
  )
}

export default ConfirmationContainer